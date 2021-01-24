import React, { Component } from "react";
import Modal  from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Backdrop from '@material-ui/core/Backdrop';
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
import "./add-event.css";

class AddEventModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTimeValid: false,
      isTimeAcceptable: false,
      events: [],
      enableEditing: true,
      errorTitleField: false,
      errorStartTimeField: false,
      errorEndTimeField: false,
      startTimeErrorMsg: "Start Time is required",
      titleErrorMsg: "Title is required",
      endTimeErrorMsg: "End Time is required",
      validationError: false,
      timeValidation: false,
      showModal: this.props.showModal || false,
      toggleModal: this.props.toggleModal,
      eventToEdit: this.props.eventToEdit,
      handleFormSubmit: this.props.handleFormSubmit,
      onRemoveEventClick: this.props.onRemoveEventClick
    };
    this.enableEdit = this.enableEdit.bind(this);
  }

  componentDidMount() {
    
  }

  validateTime(startTime, endTime, date) {
    {
        if(startTime < endTime){
          /*if((this.state.eventToEdit.startTime < e.startTime ||
            this.state.eventToEdit.startTime > e.endTime) &&
            (this.state.eventToEdit.endTime < e.startTime ||
              this.state.eventToEdit.endTime > e.endTime))
            this.setState({
              isTimeValid: true,
              isTimeAcceptable: true
            })
          else
            alert("Your timings collide with other events in the same day")*/
            this.setState({
              isTimeValid: false,
              isTimeAcceptable: false
            })
        }
        else{
          this.setState({
            isTimeValid: true,
            isTimeAcceptable: true
          })
        }
    }
  }

  submitForm = e => {
    let events =
      localStorage.getItem("CalendarEvents") !== ("undefined" && null)
        ? JSON.parse(localStorage.getItem("CalendarEvents"))
        : []
    this.setState({ events: events });
    e.preventDefault();
    const {date, id, title, description, startTime, endTime } = this.state.eventToEdit;
    const date1 = this.props.selectedDate
    if(startTime < endTime){
      for(var i = 0; i < events.length; i++){
        if(!this.props.displayEditButton){
          if(parseInt(events[i].date.substring(8,10))+1 === parseInt(date1.getDate())){
            if((startTime < events[i].startTime && 
              endTime < events[i].startTime) || 
              (startTime > events[i].endTime && 
                endTime > events[i].endTime)){
                  this.setState({
                    isTimeValid: true
                  });
            }
            else{
              this.setState({
                isTimeValid: false
              });
              alert("timings clashes with other events on the same day")
              break;
            }
          }
          else{
            this.setState({
              isTimeValid: true
            });
          }
        }
        else if(this.props.displayEditButton){
          if(parseInt(events[i].date.substring(8,10)) === parseInt(date1.getDate())-1){
            if((startTime < events[i].startTime && 
              endTime < events[i].startTime) || 
              (startTime > events[i].endTime && 
                endTime > events[i].endTime)){
                  this.setState({
                    isTimeValid: true
                  });
            }
            else{
              this.setState({
                isTimeValid: false
              });
              alert("timings clashes with other events on the same day")
              break;
            }
        }
        else{
          this.setState({
            isTimeValid: true
          });
        }

        }
      }
    }
    else{
      this.setState({
        isTimeValid: false
      });
      alert("start time is less than or equal to end time")
    }
    if(this.state.isTimeValid == true){
      this.state.handleFormSubmit({
        id,
        title,
        description,
        date,
        startTime,
        endTime
      });
    }
  };

  removeEvent = e => {
    e.preventDefault();
    const { id, date } = this.state.eventToEdit;
    this.state.onRemoveEventClick({
      id,
      date
    });
  };

  setTitle = t => {
    if(t === ""){
      this.setState({
        errorTitleField: true,
        titleErrormsg: "This field is required"
      })
    } 
    else if(t.match(/^[0-9]+$/i) || t === ""){
      this.setState({
        errorTitleField: true,
        titleErrormsg: "Please enter alphanumeric values"
      })
    }
    else {
        this.setState({
          errorTitleField: false,
          titleErrorMsg: ""
        })
    }
    this.setState(prevState => ({
      eventToEdit: {
        ...prevState.eventToEdit,
        title: t
      }
    }));
  };

  setDescription = d => {
    this.setState(prevState => ({
      eventToEdit: {
        ...prevState.eventToEdit,
        description: d
      }
    }));
  };

  setStartTime = t => {
    if(t === null || t === ""){
      this.setState({
        errorStartTimeField: true,
        startTimeErrorMsg: "Start Time is required"
      })
    }
    else {
        this.setState({
          errorStartTimeField: false,
          startTimeErrorMsg: ""
        })
    }
    this.setState(prevState => ({
      eventToEdit: {
        ...prevState.eventToEdit,
        startTime: t
      }
    }));
  };

  setEndTime = t => {
    if(t === "" || t === null){
      this.setState({
        enableEditing: true,
        errorEndTimeField: true,
        endTimeErrorMsg: "End Time is required"
      })
    } 
    else {
        this.setState({
          errorEndTimeField: false,
          endTimeErrorMsg: ""
        })
    }
    this.setState(prevState => ({
      eventToEdit: {
        ...prevState.eventToEdit,
        endTime: t
      }
    }));
  };

  enableEdit(e){
    e.preventDefault();
    this.setState({
      enableEditing: !this.state.enableEditing
    })
  }

  componentDidMount() {
    this.setState({
      enableEdit: false,
      errorTitleField: true,
      errorEndTimeField: true,
      errorStartTimeField: true
    })
  }

  render() {
    const { title, description, endTime, startTime } = this.state.eventToEdit;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.showModal}
          onClose={this.state.toggleModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 300,
            }}>
          <div className="paper add-event-modal">
            <center>
              <h2 id="simple-modal-title">Edit Event Data</h2>
            </center>
            <form onSubmit={this.submitForm}>
              <div>
                <TextField
                  disabled={this.state.enableEditing && !this.props.fabPressed}
                  error={this.state.errorTitleField}
                  helperText={this.state.titleErrormsg}
                  required
                  id={title}
                  label="Event Title"
                  defaultValue={title}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={e => this.setTitle(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  disabled={this.state.enableEditing && !this.props.fabPressed}
                  id={description}
                  label="Event Description"
                  defaultValue={description}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={e => this.setDescription(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  disabled={this.state.enableEditing && !this.props.fabPressed}
                  required
                  error= {this.state.errorStartTimeField}
                  helperText= {this.state.startTimeErrorMsg}
                  id={startTime}
                  type="time"
                  label="Start Time"
                  defaultValue={startTime}
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{
                    step: 300 // 5 min
                  }}
                  onChange={e => this.setStartTime(e.target.value)}
                />
                <TextField
                  disabled={this.state.enableEditing && !this.props.fabPressed}
                  required
                  error= {this.state.errorEndTimeField}
                  helperText= {this.state.endTimeErrorMsg}
                  id={endTime}
                  type="time"
                  label="End Time"
                  defaultValue={endTime}
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{
                    step: 300 // 5 min
                  }}
                  onChange={e => this.setEndTime(e.target.value)}
                />
             
              </div>
              <div className="event-button">
                  <Button
                    disabled= {(this.state.errorTitleField || (this.state.errorEndTimeField || this.state.errorStartTimeField))}
                    style= {{marginRight: "16px"}}
                    variant="contained"
                    color="primary"
                    onClick = {this.submitForm}>Save This Event</Button>
                  {this.props.displayEditButton ? <Button
                    variant="contained"
                    color="primary"
                    onClick={this.removeEvent}>Remove This Event</Button> : null}

                  {this.props.displayEditButton ? <Button
                    disabled={!this.state.enableEditing}
                    variant="contained"
                    color="primary"
                    style={{marginLeft: "16px"}}
                    onClick={this.enableEdit}>Edit This Event</Button> : null}
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AddEventModal;