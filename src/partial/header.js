import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';

class Header extends React.Component {
  constructor() {
    super()
    this.state = { 
        isOpen: false,
        logoutAlert: (window.location.search.indexOf('logout') !== -1)
    }

    this.onDismiss = this.onDismiss.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange() { this.setState({ isOpen: !this.state.isOpen }) }

  onDismiss() { this.setState({ logoutAlert: false }) }

  render() {
    return (
      <div>
        <header>
          <Navbar color="light" light expand="md">
            <NavbarBrand>WeMusic</NavbarBrand>
            <NavbarToggler onClick={this.handleChange} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto" navbar>
                
                <NavItem>
                  <Link to="/" className="nav-link">Home</Link>
                </NavItem>

                
                {!Object.keys(this.props.user).length && /* not logged in */
                  <>
                    <NavItem>
                        <NavLink to="/register" className="nav-link">Register</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/login" className="nav-link">Login</NavLink>
                    </NavItem>
                  </>
                }

                {Object.keys(this.props.user).length > 0 && /* logged in */
                  <>
                    <NavItem>
                        <NavLink to="/lobby" className="nav-link">Lobby</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/profile" className="nav-link">Profile</NavLink>
                    </NavItem>
                    <NavItem>
                        <a href="/?logout" className="nav-link">Logout</a>
                    </NavItem>
                  </>
                }
              </Nav>
            </Collapse>
          </Navbar>
        </header>

        <Alert color="success" className="home-alert" isOpen={this.state.logoutAlert} toggle={this.onDismiss}>
          Success! You are now logged out
        </Alert>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return { 
      user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
      dispatch
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);