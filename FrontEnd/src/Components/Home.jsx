import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink ,Link} from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap';


function Home() {

    const[dat,setDat]=useState()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchData,setSearchData]=useState('')
    const [selectedMonth, setSelectedMonth] = useState('March');  // Add state for selected month

    const [statics, setStatics] = useState([]);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [monthlyData, setMonthlyData] = useState({ totalSold: 0, notSold: 0, totalSales: 0 }); // State for monthly data

    const itemsPerPage = 10; 

    // ---navbar start-
    const monthNames  = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    
   
    // ---end ---


    useEffect(()=>{
            getData();
    },[])

    const getData = async() =>{

        const arr = await axios.get('http://localhost:1000/')
        setDat(arr.data)
    }

    // console.log(dat)
    // ----------search start----------

    // Handle search input change
    const handleSearch = (e) => {
        setSearchData(e.target.value);
        setCurrentPage(1);
    };

        const handleMonthSelect = (month) => {
        setSelectedMonth(month);
        setCurrentPage(1); // Reset to first page when changing month
        calculateMonthlyData(month); // Calculate monthly data when a month is selected
        setShowModal(true); // Show modal
    };

   
    const filteredData = Array.isArray(dat) ? dat.filter(item => {
        const itemDate = new Date(item.dateOfSale);
        const itemMonth = itemDate.toLocaleString('default', { month: 'long' });

        return (
            (!selectedMonth || itemMonth === selectedMonth) &&
            (item.title.toLowerCase().includes(searchData.toLowerCase()) ||
            item.description.toLowerCase().includes(searchData.toLowerCase()) ||
            item.price.toString().includes(searchData) ||
            item.category.toLowerCase().includes(searchData.toLowerCase()) ||
            item.sold.toString().includes(searchData))
        );
    }) : [];
    
    // ---------search end-----------



    // --------pagination start------
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData =   filteredData.slice(indexOfFirstItem, indexOfLastItem);
    
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNext = () => {
        if (currentPage < Math.ceil(  filteredData.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    // --------pagination end------

        // statistics transactions start

    const statistics = async() =>{

       var aa =  await axios.get('http://localhost:1000/statistics')
        setStatics(aa.data)
    }

    
    useEffect(()=>{
        statistics();
},[])

    // console.log(statics.data)
    const calculateMonthlyData = (month) => {
        if (!Array.isArray(statics) || statics.length === 0) {
            return { totalSold: 0, notSold: 0, totalSales: 0 };
        }
    
        const monthData = statics.filter(item => {
            const itemMonth = new Date(item.dateOfSale).getMonth();
            console.log('Month Data Filter:', itemMonth, month); // Log month filtering
            return itemMonth === month; // Filter by month
        });
    
        
        const totalSold = monthData.filter(item => item.sold === true).length;
        const notSold = monthData.filter(item => item.sold === false).length;
        const totalSales = monthData.reduce((sum, item) => {
            const priceValue = parseFloat(item.price); // Parse price
            if (item.sold && !isNaN(priceValue)) { // Ensure it's sold and price is valid
                return sum + priceValue;
            }
            return sum;
        }, 0);
        
        console.log('Filtered Month Data:', monthData); // Log filtered month data
        console.log('Total Sold:', totalSold); // Log total sold items
        console.log('Not Sold:', notSold); // Log total not sold items
        console.log('Total Sales:', totalSales); // Log total sales
    
        // Set the monthly data to be displayed in the modal
        setMonthlyData({ totalSold, notSold, totalSales });
    };
     // Handle modal close
     const handleClose = () => setShowModal(false);

  return (
   <>
      <nav className="navbar navbar-expand-lg bg-info"style={{height:'60px'}} >
  <div className="container-fluid  ">
        <div className=""  >
        <img src="roxiler.png" alt="" className='p-1' height={'100px'} width={'90px'} />
        </div>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse " id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
       
        <li className="nav-item">
          <NavLink className="nav-link" to="/"></NavLink>
        </li>
        
        <li className="nav-item dropdown   ">
          <NavLink className="nav-link dropdown-toggle " to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Select Month
          </NavLink>
          <ul className="dropdown-menu  ">

            {
               monthNames &&  monthNames.map((month,i)=>{
                    return(
    
                        <li key={i} ><Link className="dropdown-item text-dark" onClick={() => handleMonthSelect(month)}
                         to='' >{month}</Link></li>
                    )
                })
            }


            
          </ul>
        </li>



      </ul>
          <li  className="nav-item dropdown  d-flex me-4  " ><NavLink className='nav-link nav-link 'role="button" data-bs-toggle="dropdown" aria-expanded="false"  >
          <svg xmlns="http://www.w3.org/2000/svg" width="37" height="22" fill="currentColor" class="bi bi-bar-chart-fill" viewBox="0 0 16 16">
          
          <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
          </svg>  
</NavLink>

            <ul className="dropdown-menu  ">

            {
            monthNames &&  monthNames.map((month,i)=>{
                    return(

                        <li key={i} className='overflow-x-hidden' >
                    
                            <Link
                                className="dropdown-item text-dark"
                                onClick={() => handleMonthSelect(i)}
                                to="">
                                {month}
                            </Link>
                        
                    </li>
                    )
                })
            }



            </ul>
            {/* Bootstrap Modal for Monthly Statistics */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Transaction Statistics of Month: {selectedMonth}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Total Sold: {monthlyData.totalSold}</p>
                    <p>Not Sold: {monthlyData.notSold}</p>
                    <p>Total Sales: {monthlyData.totalSales.toFixed(2)} </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </li>  

      <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
        <input className="form-control me-2"  value={searchData} onChange={handleSearch}  type="search" placeholder="Search" aria-label="Search"/>
        {/* <button className="btn btn-outline-success" type="submit">Search</button> */}
      </form>
      
    </div>
  </div>
</nav>

    <div className="container">
        <div className="row">

            <div className="col-12 py-2">   
                <h4>Transaction Dashboard </h4>
            </div>

            <div className="col-12">

    <table className='table table-dark table-striped text-center' >

<thead>
  
    <tr>
        <th>Sr.No</th>
        <th>Title</th>
        <th>Description</th>
        <th>Price</th>
        <th>Category</th>
        <th>Sold</th>
        <th>Image</th>
        <th>Date</th>
        
    </tr>
</thead>
<tbody >
    {
        currentData && currentData.map((val,i)=>{
            return(
                <tr key={i}>
        <td>{indexOfFirstItem + i + 1}</td>
        <td>{val.title}</td>
        <td>{val.description}</td>
        <td>{val.price}</td>
        <td>{val.category}</td>
        <td>{val.sold}</td>

        <td>
            <img src={val.image} height={'100px'} width={'100px'} alt="" />
        </td>
        <td>{new Date(val.dateOfSale).toLocaleDateString('en-GB')}</td>
       
    </tr>
            )
        })
    }   
    {currentData.length === 0 && (
                                    <tr>
                                        <td colSpan="8">No data available.</td>
                                    </tr>
                                )}
    
</tbody>
</table>


<div className="d-flex justify-content-between align-items-center mb-2">
        <div>
            Page Number : {currentPage} 
        </div>
        <div className="pagination">
            <button className="btn btn-outline-primary m-1" onClick={handlePrevious} disabled={currentPage === 1}>
                Previous
            </button>
            <button className="btn btn-outline-primary m-1" onClick={handleNext} disabled={currentPage === Math.ceil( filteredData.length / itemsPerPage)}>
                Next
            </button>
        </div>
        <div>
            Items per page: {itemsPerPage}
        </div>
    </div>





            </div>
        </div>
    </div>
   
   </>
  )
}

export default Home