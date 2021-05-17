import { Navbar, Form } from "react-bootstrap";
import FormControl from 'react-bootstrap/FormControl';
import { BsCheckAll } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";

function MyNavbar(props) {
  return (

    <Navbar fixed="top" bg="success" variant="dark" className="justify-content-between">

      <Navbar.Brand href="index.html">
        <BsCheckAll size="2em"></BsCheckAll> ToDo Manager
        </Navbar.Brand>

      <Form className="form-inline my-2 my-lg-0 mx-auto d-none d-sm-block" action="#" role="search" aria-label="Quick search">
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      </Form>

      <a className="nav-item nav-link" href="index.html">
        <BiUserCircle size="2em" color="white"></BiUserCircle>
      </a>

    </Navbar>

  );
}

export default MyNavbar;