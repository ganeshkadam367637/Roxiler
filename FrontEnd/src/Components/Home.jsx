import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink ,Link} from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap';
import Charts from './Charts';
function Home() {

    const[dat,setDat]=useState()
    const [currentPage, setCurrentPage] = useState(1);
    const [searchData,setSearchData]=useState('')
    const [selectedMonth, setSelectedMonth] = useState('March'); 

    const [statics, setStatics] = useState([]);
    const [showModal, setShowModal] = useState(false); 
    const [monthlyData, setMonthlyData] = useState({ totalSold: 0, notSold: 0, totalSales: 0 }); 

    const itemsPerPage = 10; 

    const monthNames  = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    useEffect(()=>{
            getData();
    },[])

    const getData = async() =>{

        const arr = await axios.get('roxiler.com/product_transaction.json')
        setDat(arr.data)
    }
    const handleSearch = (e) => {   // ----------search start----------
        setSearchData(e.target.value);
        setCurrentPage(1);
    };

    const handleMonthSelect = (monthIndex) => {
        setSelectedMonth(monthNames[monthIndex]); 
        calculateMonthlyData(monthIndex);  
        setShowModal(true);  
    };

    const handleMonthSelec = (month) => {
        setSelectedMonth(month);
        setCurrentPage(1); 
        calculateMonthlyData(month); 
    };
   
    const filteredData = Array.isArray(dat) ? dat.filter(item => {
        const itemDate = new Date(item.dateOfSale);
        const itemMonth = itemDate.getMonth();  
    
        return (
            (!selectedMonth || itemMonth === monthNames.indexOf(selectedMonth)) &&
            (item.title.toLowerCase().includes(searchData.toLowerCase()) ||
            item.description.toLowerCase().includes(searchData.toLowerCase()) ||
            item.price.toString().includes(searchData) ||
            item.category.toLowerCase().includes(searchData.toLowerCase()) ||
            item.sold.toString().includes(searchData))
        );
    }) : [];   // ---------search end-----------

    const indexOfLastItem = currentPage * itemsPerPage;   // --------pagination start------
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
    };      // --------pagination end------

    const statistics = async() =>{  // statistics transactions start
       var aa =  await axios.get('roxiler.com/product_transaction.json')
        setStatics(aa.data)
    }

    useEffect(()=>{
        statistics();
    },[])

        const calculateMonthlyData = (monthIndex) => {
            const monthData = statics.filter(item => {
                const itemMonth = new Date(item.dateOfSale).getMonth();
                return itemMonth === monthIndex;
            });
            
            const totalSold = monthData.filter(item => item.sold === true).length;
            const notSold = monthData.filter(item => item.sold === false).length;
            const totalSales = monthData.reduce((sum, item) => {
                const priceValue = parseFloat(item.price);
                return item.sold && !isNaN(priceValue) ? sum + priceValue : sum;
            }, 0);

            setMonthlyData({ totalSold, notSold, totalSales });
        };

     const handleClose = () => setShowModal(false);

  return (
   <>
      <nav className="navbar navbar-expand-lg bg-info fixed-top "style={{height:'60px'}} >
  <div className="container-fluid  ">
        <div className=""  >
        <img src="roxiler.png" alt="" className='p-1' height={'100px'} width={'90px'} />
        </div>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span> </button>
    <div className="collapse navbar-collapse " id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
       
                <li className="nav-item">
                <NavLink className="nav-link" to="/"></NavLink>
                </li>
                <li className="nav-item dropdown   ">
                <NavLink className="nav-link dropdown-toggle " to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Select Month  </NavLink>
                        <ul className="dropdown-menu  ">
                                    {
                                    monthNames &&  monthNames.map((month,i)=>{
                                            return(
                            
                                                <li key={i} ><Link className="dropdown-item text-dark" onClick={() => handleMonthSelec(month)}
                                                to='' >{month}</Link></li>
                                            )
                                        })
                                    }
                                    
                          </ul>
                </li>
       </ul>

          <li  className="nav-item dropdown  d-flex me-4  " title='Monthwise Revenue' ><NavLink className='nav-link nav-link 'role="button" data-bs-toggle="dropdown" aria-expanded="false"  >
            <svg xmlns="http://www.w3.org/2000/svg" width="37" height="22" fill="currentColor" className="bi bi-bar-chart-fill" viewBox="0 0 16 16">      
            <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
            </svg> 
           </NavLink>
                <ul className="dropdown-menu  ">
                        {
                        monthNames &&  monthNames.map((month,i)=>{
                                return(

                                    <li key={i} className='overflow-x-hidden' >
                                        <Link className="dropdown-item text-dark" onClick={() => handleMonthSelect(i)} to=""> {month}</Link>
                                    </li>
                                ) }) }
                </ul>
            <Modal show={showModal} onHide={handleClose} centered size="md">
    <Modal.Header closeButton style={{ backgroundColor: '#17a2b8', color: 'white' }}>
        <Modal.Title className="d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-bar-chart-fill me-2" viewBox="0 0 16 16">
                <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1-1h-2a1 1 0 0 1-1-1z"/>
            </svg>
            Transaction Statistics 
        </Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ backgroundColor: '#f8f9fa' }}>
        <div className="d-flex align-items-center my-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#17a2b8" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.707 10.707a1 1 0 0 0 1.414 0L12 6.828l-.707-.707L7 9.586l-1.293-1.293-.707.707 2 2z"/>
            </svg>
            <p className="mb-0 fw-bold">Total Sold: <span className="text-primary">{monthlyData.totalSold}</span></p>
        </div>
        <div className="d-flex align-items-center my-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#dc3545" className="bi bi-x-circle-fill me-2" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
            <p className="mb-0 fw-bold">Not Sold: <span className="text-danger">{monthlyData.notSold}</span></p>
        </div>
        <div className="d-flex align-items-center my-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffc107" className="bi bi-currency-rupee"  viewBox="0 0 16 16">
            <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
            </svg>
            <p className="mb-0 fw-bold">Total Sales: <span className="text-success">₹{monthlyData.totalSales.toFixed(2)}</span></p>
        </div>
    </Modal.Body>
    <Modal.Footer style={{ backgroundColor: '#f8f9fa' }}>
        <Button variant="outline-secondary" onClick={handleClose} className="fw-bold">
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
        <div className="col-12 py-2 mt-5 py-5 text-center">   
            <h4 style={{ background: 'linear-gradient(to bottom right, rgba(13,202,240,1), rgba(13,202,240,0.1))' }} className="text-dark">Bar Chart Status</h4>
            <Charts/>
        </div>
        <div className="col-12 py-2 text-center">   
         <h4 style={{ background: 'linear-gradient(to bottom right, rgba(13,202,240,1), rgba(13,202,240,0.1))' }} className="text-dark">Transaction Dashboard</h4>
        </div>
    <div className="col-12">
        <table className='table table-info table-striped text-center' >
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>       
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
                        <td>{val.price.toFixed(2)}</td>
                        <td>{val.category}</td>
                        <td>
                            <img src={val.image} height={'100px'} width={'100px'} alt="" />
                        </td>
                        <td>{new Date(val.dateOfSale).toLocaleDateString('en-GB')}</td>
                    </tr>
                            )
                        }) }   
                    {currentData.length === 0 && (<tr>
                    <td colSpan="8">No data available.</td></tr>)}
                </tbody>
        </table>

    <div className="d-flex justify-content-between align-items-center mb-2">
            <div> Page Number : {currentPage}  </div>
            <div className="pagination">
                <button className="btn btn-outline-primary m-1" onClick={handlePrevious} disabled={currentPage === 1}>
                    Previous
                </button>
                <button className="btn btn-outline-primary m-1" onClick={handleNext} disabled={currentPage === Math.ceil( filteredData.length / itemsPerPage)}>
                    Next
                </button>
            </div>
            <div>  Items per page: {itemsPerPage}</div>
    </div>

            </div>
        </div>
    </div>                         
   </>
  )
}
export default Home