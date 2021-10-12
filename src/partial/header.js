import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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
      logoutAlert: (window.location.search.indexOf('logout') !== -1),
      deleteAlert: (window.location.search.indexOf('account-deleted') !== -1)
    }

    this.onDismiss = this.onDismiss.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleLogout = () => {
      this.props.dispatch({type: 'USER_SESSION', payload: ''})
  }

  handleChange() { this.setState({ isOpen: !this.state.isOpen }) }

  onDismiss() { this.setState({ logoutAlert: false }) }
  onDelete() { this.setState({ deleteAlert: false }) }

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

                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Account
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          <NavLink to="/manage-profile" className="nav-link">Profile</NavLink>
                        </DropdownItem>
                        <DropdownItem>
                          <NavLink to="/manage-playlist" className="nav-link">Playlist</NavLink>
                        </DropdownItem>
                        <DropdownItem>
                          <NavLink to="/manage-rooms" className="nav-link">Rooms</NavLink>
                        </DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>
                          <NavItem>
                            <NavLink to="/reset-password" className="nav-link">Reset Password</NavLink>
                          </NavItem>
                        </DropdownItem>
                        <DropdownItem>
                          <NavItem>
                            <a href="/?logout" className="nav-link" onClick={this.handleLogout}>Logout</a>
                          </NavItem>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </>
                }
              </Nav>
            </Collapse>
          </Navbar>
        </header>

        <Alert color="success" className="home-alert" isOpen={this.state.logoutAlert} toggle={this.onDismiss}>
          Success! You are now logged out
        </Alert>

        <Alert color="danger" className="home-alert" isOpen={this.state.deleteAlert} toggle={this.onDelete}>
          Success! Your profile has been deleted.
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