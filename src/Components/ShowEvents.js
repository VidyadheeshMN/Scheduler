import { List, Link } from "@material-ui/core";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import moment from "moment";

class ShowEvents extends Component{
    constructor(){
        super();
        this.state = {
            number: 1,
            events: [],
            isCalendarOpen: false
        };
    }

    componentDidMount() {
        let events =
             localStorage.getItem("CalendarEvents") !== ("undefined" && null)
                ? JSON.parse(localStorage.getItem("CalendarEvents"))
                : []
        this.setState({ events: events });
    }

    RenderCalendar(){
        this.setState({
            isCalendarOpen: !this.state.isCalendarOpen
        });
    }

    render(){
        return(
            <>
            <h1>Event Information</h1>
            <div>
            <Table
              striped
              bordered
              hover
              variant="light"
              responsive
              className="search-body-table"
            >
              <thead>
                    <tr>
                    <th>Number</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Date</th>
                    <th>Start time</th>
                    <th>End time</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.events?this.state.events.map((event) => {
                    return(
                        <tr>
                            <td>
                                {this.state.number++}
                            </td>
                            <td>
                                {event.title}
                            </td>
                            <td>
                                {event.description}
                            </td>
                            <td>
                                {event.date.substring(0,4)}
                            </td>
                            <td>
                                {moment(event.date).format('MMMM')}
                            </td>
                            <td>
                                {parseInt(event.date.substring(8,10))+1}
                            </td>
                            <td>
                                {event.startTime}
                            </td>
                            <td>
                                {event.endTime}
                            </td>
                        </tr>
                    );
                }):null}
                </tbody>
                 
                </Table>
            </div>
            <Button onClick={() => this.RenderCalendar()}>
                Back
            </Button>
            {this.state.isCalendarOpen ? <Redirect
                  to={{
                    pathname: "/calendar"
                  }}
                ></Redirect>:null}
            </>
        );
    };
}

export default ShowEvents;