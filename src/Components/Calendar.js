import React, { Component } from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add.js";
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import moment from "moment";
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  setMonth,
  isPast,
  setYear,
  isSunday
} from "date-fns";
import AddEventModal from "./add-event";
import "./Calendar.css";

const EVENT_LIMIT = 15;

class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      showMonthTable: false,
      showYearTable: false,
      isDropdownOpen: false,
      fabPressed: true,
      displayEditButton: true,
      currentMonth: new Date(),
      currentYear: new Date(),
      selectedDate: new Date(),
      disabledDate: new Date(),
      dateObject: moment(),
      allmonths: moment.months(),
      isEventOpen: false,
      events: [],
      cloneDay: new Date(),
      showEventModal: false,
      eventToEdit: {},
      eventToShow: {},
      age: "",
      open: false
    };
  }

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen }); 

  handleClose = () => {
    this.setState({
      open: false
    })
  };

  handleOpen = () => {
    this.setState({
      open: true
    })
  };

  year = () => {
    return this.state.dateObject.format("Y");
  };
  
  month = () => {
    return this.state.dateObject.format("MMMM");
  };

  componentDidMount() {
    let events =
      localStorage.getItem("CalendarEvents") !== ("undefined" && null)
        ? JSON.parse(localStorage.getItem("CalendarEvents"))
        : []
    this.setState({ events: events });
  } 

  toggleDropdown = () => {
    this.setState({openDropdown: true})
    console.log(this.state.openDropdown)
  }

  setMonths = month => {
    let monthNo = this.state.allmonths.indexOf(month);
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set("month", monthNo);
    
    this.setState({
      currentMonth: setMonth(this.state.currentMonth, monthNo),
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable
    });
  };

  setYears = year => {
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set("year", year);
    this.setState({
      currentYear: setYear(this.state.currentYear, year),
      dateObject: dateObject,
      showYearTable: !this.state.showYearTable
    });
  };

  YearList = props => {
    let months = [];
    let nextten = moment()
      .set("year", props)
      .add("year", 12)
      .format("Y");

    let tenyear = this.getDates(props, nextten);

    tenyear.map(data => {
      months.push(
        <td
          key={data}
          className="calendar-month"
          onClick={e => {
            this.setYears(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let yearlist = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    return (
      <table className="calendar-month">
        <tbody>{yearlist}</tbody>
      </table>
    );
  };

  MonthList = props => {
    let months = [];
    props.data.map(data => {
      months.push(
        <td
          key={data}
          className="calendar-month"
          onClick={e => {
            this.setMonths(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    return null});
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i === 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let monthlist = rows.map((d) => {
      return <tr>{d}</tr>;
    });

    return (
      <table className="calendar-month">
        <tbody>{monthlist}</tbody>
      </table>
    );
  };

  showMonth = () => {
    this.setState({
      showMonthTable: !this.state.showMonthTable
    });
  };

  showYear = () => {
    this.setState({
      showYearTable: !this.state.showYearTable
    });
  };

  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY"));
      currentDate = moment(currentDate).add(1, "year");
    }
    return dateArray;
  }

  renderHeader() {
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>chevron_left</div>
        </div>
        <div className="col col-center">
        <span onClick={() => {this.showMonth();}}>{!this.state.showMonthTable ? (
            <div style={{float: "left", marginLeft: "33%", cursor: "pointer"}}>
                {this.month()}
            </div>):<div className=""> <this.MonthList data={moment.months()} /> </div>}
        </span>
        {/*<span onClick={() => {this.showYear();}}>{!this.state.showYearTable ? (
            <div style={{float: "right", marginRight: "33%", cursor: "pointer"}}>
                {this.year()}
            </div>):<div className=""> <this.YearList props={this.year()}/> </div>}
        </span>*/}
        <span onClick={() => {this.showYear();}}>
            <div style={{float: "right", marginRight: "33%", cursor: "pointer"}}>
                {this.year()}
            </div>
        </span>
        <Button onClick={() => {this.showEvents()}} style={{marginRight: "-1%", marginBottom:"-30px" ,fontSize:"15px", marginTop:"-1%", color: "White"}}>Show All Events</Button>
        </div>
        {this.state.isEventOpen ? <Redirect to={{pathname: "/events"}} /> : null}
        <div className="col col-end">
          <div className="icon" onClick={this.nextMonth}>chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const days = [];
    for (let day of daysOfWeek) {
      days.push(
        <div className="col col-center" key={day}>
          {day}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate, events } = this.state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate ) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat, {
          useAdditionalDayOfYearTokens: false
        });
        const cloneDay = day;
        days.push(
          <div 
            className={`col cell ${
              (!isSameMonth(day, currentMonth))
                ? "disabled"
                : isSameDay(day, selectedDate)
                ? "selected"
                : isPast(addDays(day, 1)) ? "disabled" : ""
            }`}
            key={day}
          >
            <span className={`number text-outline ${isSunday(day) ? "sunday" : "" }`}>{formattedDate}</span>
            {isSameMonth(day, monthStart) ? (
              <div>
                <div>
                  {events
                    .filter(e => isSameDay(cloneDay, new Date(e.date)))
                    .sort((a, b) => (a.startTime > b.startTime ? true : false))
                    .map((e, i) => (
                      <div
                        onClick={() => this.editEvent(e)}
                        key={i}
                        className="event-data"
                        data-toggle="tooltip"
                              data-placement="top"
                              title="Click to Edit"
                      >
                        {e.startTime} - {e.endTime} -{">"} {e.title}
                      </div>
                    ))}
                </div>
                <div key={"add-event-" + day} className={`add-event-button ${
                  isSameDay(day, selectedDate) ? "" : 
                    isPast(addDays(day, 1)) ? "fab-icon-disabled" : 
                      "" }`}>
                  <Fab
                    color="primary"
                    disabled={this.state.disabled}
                    size="small"
                    aria-label="add"
                    onClick={() => this.onAddEventClick(cloneDay)}>
                    <AddIcon />
                  </Fab>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  editEvent = e => {
    this.setState({
      eventToEdit: e,
      displayEditButton: true,
      fabPressed: false
    }, this.toggleModal);
  };

  nextMonth = () => {
    let curr = "";
    if (!this.state.currentMonth) {
      curr = "year";
    } else {
      curr = "month";
    }
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, 1),
      dateObject: this.state.dateObject.add(1, curr)
    }) 
  };

  prevMonth = () => {
    let curr = "";
    if (!this.state.currentMonth) {
      curr = "year";
    } else {
      curr = "month";
    }
    this.setState({
      currentMonth: subMonths(this.state.currentMonth, 1),
      dateObject: this.state.dateObject.subtract(1, curr)
    });
  };

  toggleModal = () => {
    const { showEventModal } = this.state;
    const newState = { showEventModal: !showEventModal };
    if (showEventModal) {
      newState.eventToEdit = {};
    }
    this.setState(newState);
  };

  toggleInfoModal = () => {
    const { showInfoModal } = this.state;
    const newState = { showInfoModal: !showInfoModal };
    if (showInfoModal) {
      newState.eventToShow = {};
    }
    this.setState(newState);
  }

  onAddEventClick = ( date ) => {   
    this.setState({
      fabPressed: true,
      displayEditButton: false,
      selectedDate: date
    });
    const { events } = this.state;
    if (
      events.filter(ev => isSameDay(date, new Date(ev.date))).length >=
      EVENT_LIMIT
    ) {
      alert("You have reached maximum events limit for the selected day");
    } else {
      this.setState({ 
        selectedDate: date,  
      }, this.toggleModal);
    }
  };

  onRemoveEventClick = ({ id, date }) => {
    const { events } = this.state;
    this.setState({ 
      selectedDate: date
    });
    if (id) {
      const eventIndex = events.findIndex(e => e.id === id);
      events.splice(eventIndex, 1);
      this.setState({ events }, () => {
        this.toggleModal();
      });
      localStorage.setItem("CalendarEvents", JSON.stringify(events));
    }
  };

  handleFormSubmit = ({ id, title, description, date, startTime, endTime }) => {
    const { selectedDate, events } = this.state;
    if (id) {
      const updatedEvent = {
        id,
        title,
        description,
        date,
        startTime,
        endTime
      };
      const eventIndex = events.findIndex(e => e.id === id);
      events.splice(eventIndex, 1, updatedEvent);
      this.setState({ events }, () => {
        this.toggleModal();
        const { events } = this.state;
        localStorage.setItem("CalendarEvents", JSON.stringify(events));
      });
    } else {
      const lastEvent = events[events.length - 1];
      const newEvent = {
        id: ((lastEvent && lastEvent.id) || 0) + 1,
        title,
        description,
        date: selectedDate,
        startTime,
        endTime
      };
      this.setState({ events: events.concat(newEvent) }, () => {
        this.toggleModal();
        const { events } = this.state;
        localStorage.setItem("CalendarEvents", JSON.stringify(events));
      });
    }
  };

  showEvents() {
    this.setState({
      isEventOpen: !this.state.isEventOpen
    });

  }

  render() {
    const { showEventModal, eventToEdit } = this.state;
    
    return (
      <div className="calendar">
        {showEventModal && (
          <AddEventModal
            selectedDate = {this.state.selectedDate}
            fabPressed = {this.state.fabPressed}
            displayEditButton={this.state.displayEditButton}
            showModal={showEventModal}
            toggleModal={this.toggleModal}
            handleFormSubmit={this.handleFormSubmit}
            eventToEdit={eventToEdit}
            onRemoveEventClick={this.onRemoveEventClick}
          />
        )}
        {}
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
        {console.log(eventToEdit)}
      </div>
    );
  }
}
export default Calendar;