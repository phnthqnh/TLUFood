import { Navbar, Container, Form, InputGroup, Offcanvas, Dropdown, Button, Alert, ListGroup } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'

import Logo from '../assets/Logo.svg'
import SearchLogo from '../assets/Search.svg'
import UserLogo from '../assets/User.svg'
import GroupLogo from '../assets/Group.svg'
import BagLogo from '../assets/Bag.svg'
import Cart from './Cart';
import Currency from './Currency'
import './Custom.css'
import dishesApi from '../api/dishes';

function Header() {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    // Ngăn người dùng sử dụng các nút điều hướng trên Header khi đang ở trang thanh toán 
    const location = useLocation()
    const isCheckout = location.pathname === '/checkout'
    const [showAlert, setShowAlert] = useState(false)
    const [dishes, setDishes] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDishes, setFilteredDishes] = useState([]);

    const handleClose = () => setShowOffcanvas(false);
    const handleShow = () => {
        if (isCheckout) {
            setShowAlert(true)
        } else {
            setShowOffcanvas(true);
        }
    }

    // Lấy dữ liệu cho việc tìm kiếm sản phẩm 
    useEffect(() => {
        const fetchDishes = async() => {
            try {
                const response = await dishesApi.getAllDishes()
                setDishes(response.items || [])
            } catch (error) {
                console.log('Lỗi lấy dữ liệu tìm kiếm: ', error)
            }
        }

        fetchDishes()
    }, [])

    const handleSearch = (query) => {
        setSearchQuery(query)
        if (query === '') {
            setFilteredDishes([])
        } else {
            const filtered = dishes.filter(dish => {
                return dish.flavorName.toLowerCase().includes(query.toLowerCase())  // So sánh giá trị người dùng nhập với tên món (flavorName)
            })
            setFilteredDishes(filtered)
        }
    }

    // Ẩn phần tìm kiếm sau khi người dùng chọn một món ăn trong phần tìm kiếm này
    const handleSelectDish = (dishId, dishName) => {
        setSearchQuery('')
        setFilteredDishes([])
    }

    return (
        <>
            <Navbar className='bg-white'>
                <Container className='py-2 d-flex justify-content-between'>
                    {/* Logo  */}
                    <Navbar.Brand as={Link} to="/">
                        <img src={Logo} alt="TLU Food Logo" height="35" className="d-inline-block" />
                    </Navbar.Brand>

                    {/* Tìm kiếm */}
                    <Form className='position-relative'>
                        <InputGroup className='rounded-pill bg-body-secondary px-3' style={{ cursor: 'pointer', width: '500px', height: '4030' }} >
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="rounded-pill bg-body-secondary border-0 me-2"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <img
                                src={SearchLogo}
                                alt="Search Logo"
                                height='20'
                                className="align-self-center"
                            />
                        </InputGroup>
                        {/* Phần hiển thị kết quả tìm kiếm  */}
                        {filteredDishes.length > 0 && (
                            <ListGroup className='z-3 position-absolute mt-2 overflow-y-auto' style={{ maxHeight: '300px' }}>
                                {filteredDishes.map(dish => (
                                    <ListGroup.Item
                                        key={dish.beanId}
                                        onClick={() => handleSelectDish(dish.beanId, dish.flavorName)}
                                        style={{width: '500px'}}
                                    >
                                        <Link to={dish ? `/dish/${dish.beanId}` : '/'} className="text-decoration-none text-dark">
                                            <div className="d-flex">
                                                <img
                                                    src={dish.imageUrl}
                                                    className='object-fit-scale'
                                                    style={{width: '35px', height: '30px'}}
                                                />
                                                <h6 className='ms-3 pt-2'>{dish.flavorName}</h6>
                                            </div>
                                        </Link> 
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Form>

                    <div className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                        {/* Blog  */}
                        <Link to='/blog'>
                            <img src={GroupLogo} alt="Group Logo" height='30' className='me-4'/>                        
                        </Link>
                        {/* Giỏ hàng */}
                        <img src={BagLogo} alt="Bag Logo" height='30' className='me-2' onClick={handleShow}/>
                        {/* Người dùng */}
                        <Dropdown className='p-0'>
                            <Dropdown.Toggle className='bg-transparent border border-0'>
                                <img src={UserLogo} className='' alt="User Logo" height='30'/>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <Link to='/acc' className='text-decoration-none text-black'>
                                        Tài khoản
                                    </Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link to='/orders' className='text-decoration-none text-black'>
                                        Đơn hàng của tôi
                                    </Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <Link to='/login' className='text-decoration-none text-black'>
                                        Đăng nhập
                                    </Link>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Container>
            </Navbar>

            {/* Giỏ hàng */}
            <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className='fw-bold'>Giỏ hàng</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Cart />
                </Offcanvas.Body>
                <div className="mt-auto px-3 py-2 border-top">
                    <div className="d-flex justify-content-between align-items-end">
                        <p className=''>Tổng cộng</p>
                        <p><Currency amount={100000}/></p>
                    </div>
                    <Link to='/checkout'>
                        <Button className='buttonHover rounded-pill' style={{width: '100%'}}>
                            Thanh toán
                        </Button>
                    </Link>
                </div>
            </Offcanvas>

            {/* Hiển thị thông báo khi người dùng nhấn vào giỏ hàng khi đang ở trang thanh toán  */}
            {showAlert && (
                <div className="container d-flex justify-content-center">
                    <Alert
                        variant="warning"
                        onClose={() => setShowAlert(false)}
                        dismissible
                        className="mt-3 w-50"
                    >
                        Hãy hoàn thành việc thanh toán!
                    </Alert>
                </div>
            )}
        </>
    )
}

export default Header