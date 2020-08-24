import React, { Component } from "react";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add.js";
import moment from "moment";
import {
  format,
  startOfWeek,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfYear,
  endOfYear,
  addYears,
  subYears,
  isPast
} from "date-fns";
import AddEventModal from "./add-event";
import "./Calendar.css";
import { grey, red } from "@material-ui/core/colors";

const EVENT_LIMIT = 5;

class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      currentMonth: new Date(),
      currentYear: new Date(),
      selectedDate: new Date(),
      disabledDate: new Date(),
      dateObject: moment(),
      events: [],
      showEventModal: false,
      eventToEdit: {}
    };
  }

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
        : [];
    this.setState({ events: events });
  }

  renderHeader() {
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>
            {this.month()} {this.year()}
          </span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
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
    const { currentMonth, selectedDate, events, currentYear, disabledDate } = this.state;
    const monthStart = startOfMonth(currentMonth);
    const yearStart = startOfYear(currentYear);
    const monthEnd = endOfMonth(monthStart);
    const yearEnd = endOfYear(yearStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const endYear = endOfYear(yearEnd);
    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    console.log(day)
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
            <span className="number">{formattedDate}</span>
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
                    className=""
                    size="small"
                    aria-label="add"
                    onClick={() => this.onAddEventClick(cloneDay)}
                  >
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
    this.setState({ eventToEdit: e }, this.toggleModal);
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

  nextYear = () => {
    this.setState({
      currentYear: addYears(this.state.currentYear, 1)
    });
  };

  prevYear = () => {
    this.setState({
      currentYear: subYears(this.state.currentYear, 1)
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

  onAddEventClick = ( date ) => {   
    this.setState({ 
      selectedDate: date
    });
    const { events } = this.state;
    if (
      events.filter(ev => isSameDay(date, new Date(ev.date))).length >=
      EVENT_LIMIT
    ) {
      alert(`You have reached maximum events limit for the selected day`);
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
        const { events } = this.state;
      });
      localStorage.removeItem(id);
    }
  };

  handleFormSubmit = ({ id, title, description, date, startTime, endTime }) => {
    console.log(title);
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

  render() {
    const { showEventModal, eventToEdit } = this.state;
    return (
      <div className="calendar">
        {showEventModal && (
          <AddEventModal
            showModal={showEventModal}
            toggleModal={this.toggleModal}
            handleFormSubmit={this.handleFormSubmit}
            eventToEdit={eventToEdit}
            onRemoveEventClick={this.onRemoveEventClick}
          />
        )}
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}
export default Calendar;