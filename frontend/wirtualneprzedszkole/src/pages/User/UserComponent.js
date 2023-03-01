import React from "react";
import UserService from "./UserService";
import "./Table.scss";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SortIcon from "@mui/icons-material/Sort";
import i18next from 'i18next';
import { useTranslation } from "react-i18next";



const Navi = (props) => {
  const { t } = i18next;

  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/user/" + props.value)}
      className="btn btn-info"
    >
    {t('look')}
    </button>
  );
};


class UserComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      searchTerm: "",
      sortAsc: true,
    };

    this.deleteUser = this.deleteUser.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }



  handleSearch(e) {
    this.setState({ searchTerm: e.target.value });
  }


  sortUsersByRole = () => {
    let sortedUsers = [...this.state.users];
    sortedUsers.sort((a, b) => {
      if (a.role === 'ADMIN' || a.role === 'TEACHER') {
        return -1;
      }
      if (b.role === 'ADMIN' || b.role === 'TEACHER') {
        return 1;
      }
      return 0;
    });
    this.setState({ users: sortedUsers });
  };

  loger() {
    console.log(this.state);
  }

  deleteUser(id) {
    let userName = this.state.users.find(user => user.id === id).name;
    let userlastName = this.state.users.find(user => user.id === id).lastName;
    let emaail = this.state.users.find(user => user.id === id).email;
    if(window.confirm(`Czy na pewno chcesz usunąć użytkownika: ${userName} ${userlastName} (${emaail}) ?`)) {
      UserService.deleteUser(id).then((response) => {
        this.setState({
          users: this.state.users.filter((user) => user.id !== id),
        });
        toast.success(userName + ' ' + userlastName + " został usunięty");
      }).catch(() => {
        toast.error("Wystąpił błąd podczas usuwania użytkownika");
      });
    }
  }

  componentDidMount() {
    UserService.getUsers().then((response) => {
      this.setState({ users: response.data });
      this.loger();
    });
  }

  render() {
    const { t } = i18next;

    let filteredusers = this.state.users.filter((user) =>
        user.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        (user.role === "PARENT" && "rodzic".includes(this.state.searchTerm.toLowerCase())) ||
        (user.role === "TEACHER" && "nauczyciel".includes(this.state.searchTerm.toLowerCase())) ||
        (user.role === "ADMIN" && "admin".includes(this.state.searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(this.state.searchTerm.toLowerCase())) ||
        (user.name.toLowerCase() + " " + user.lastName.toLowerCase()).includes(this.state.searchTerm.toLowerCase())
    );


    return (
        <div data-testid="user-component" className="scrollable-div1">

          <div className="abc">
            <input
                type="text"
                placeholder={t('search')}
                onChange={this.handleSearch}
            />
            <ToastContainer />
          </div>
          <div className="table-container">
          <table className="content-table">
            <thead>
            <tr className="table-head">
              <td>{t('role')}  <SortIcon className="icon" onClick={this.sortUsersByRole}/></td>
              <td>{t('name')}</td>
              <td>{t('last_name')}</td>
              <td>{t('email')}</td>
              <td>{t('actions')}</td>
              
            </tr>
            </thead>
            <tbody className="body table-body">
            {filteredusers.map((user) =>(
                <tr key={user.id}>
                  <td id="td--users">
                    {user.role === "TEACHER" ? "nauczyciel" : user.role === "ADMIN" ? "admin" : "rodzic"}
                  </td>

                  <td id="td--users">{user.name}</td>
                  <td id="td--users">{user.lastName}</td>
                  <td id="td--users">{user.email}</td>
                  <td id="td--users" className="foobar">
                    <Navi value={user.id} />
                    {/* <button onClick={() => this.props.navigation.navigate("/home//")} className='btn btn-info'>Zobacz</button> */}
                    <button
                        onClick={() => this.deleteUser(user.id)}
                        className="btn btn-danger"
                    >
                      {i18next.t('delete')}
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        </div>
    );
  }
}

export default UserComponent;
