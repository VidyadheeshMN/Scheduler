import React, { Component } from "react";

class Dropdown extends Component{
    constructor() {
        super();
        this.state = {
          listVisible: false
        };
      }
    select = (props) => {
        const item = null;
      props.selected = item;
      console.log(this.props)
    }
          
    show() {
      this.setState({ listVisible: true });
      document.addEventListener("click", this.hide);
    }
          
    hide() {
      this.setState({ listVisible: false });
      document.removeEventListener("click", this.hide);
    }

    renderListItems() {
        var items = [];
        for (var i = 0; i < this.props.list.length; i++) {
          var item = this.props.list[i];
          items.push(<div onClick={this.select.bind(null, item)}>
            <span style={{ color: item.hex }}>{item.name}</span>
          </div>);
        }
        return items;
      }
        
    render() {
        let prop=this.props.selected 
        console.log(prop)
      return <div className={"dropdown-container" + (this.state.listVisible ? " show" : "")}>
        <div className={"dropdown-display" + (this.state.listVisible ? " clicked": "")} onClick={() => this.show}>
          <span style={{ color: this.props.selected.hex }}>{this.props.selected.name}</span>
        </div>
        <div className="dropdown-list">
          <div>
            {this.renderListItems()}
          </div>
        </div>
      </div>;
    } 
}
  
export default Dropdown;