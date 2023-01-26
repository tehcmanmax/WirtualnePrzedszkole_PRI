import React from "react";
import ChildrenService from "./ChildrenService";
import "../User/Table.scss";
import { useNavigate } from "react-router-dom";
import UserService from "../User/UserService";

const Navi = (props) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/child/" + props.value, { replace: true })}
      className="btn btn-info"
    >
      Zobacz
    </button>
  );
};

class ChildrenComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: [],
    };
    this.deleteChild = this.deleteChild.bind(this);
  }

  loger() {
    console.log(this.state);
  }


  deleteChild(id) {
    let childName = this.state.children.find(child => child.id === id).name;
    let childlastName = this.state.children.find(child => child.id === id).lastName;
    if(window.confirm("Czy na pewno chcesz usunąć użytkownika: "  + childName +" " + childlastName + " "+ " ?")) {
      ChildrenService.deleteChild(id).then((response) => {
        this.setState({
          children: this.state.children.filter((child) => child.id !== id),
        });
      });
    }
  }



  componentDidMount() {
    ChildrenService.getChildren().then((response) => {
      this.setState({ children: response.data });
      this.loger();
    });
  }

  render() {
    return (
      <div>
        <table className="content-table">
          <thead>
            <tr className="table-head">
              <td>Id</td>
              <td>Imię</td>
              <td>Nazwisko</td>
              <td>Grupa</td>
              <td>Akcje</td>
            </tr>
          </thead>
          <tbody className="body">
            {this.state.children.map((child) => (
              <tr key={child.id}>
                <td>{child.id}</td>
                <td>{child.name}</td>
                <td>{child.lastName}</td>
                <td id="td--children">{child.classId}</td>
                <td>
                  <Navi value={child.id} />
                  <button
                    onClick={() => this.deleteChild(child.id)}
                    className="btn btn-danger"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ChildrenComponent;
