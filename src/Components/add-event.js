import React, { Component } from "react";
import Modal  from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Backdrop from '@material-ui/core/Backdrop';
import "./add-event.css";

class AddEventModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enableEditing: true,
      errorTitleField: false,
      errorStartTimeField: false,
      errorEndTimeField: false,
      startTimeErrorMsg: "Start Time is required",
      titleErrorMsg: "Title is required",
      endTimeErrorMsg: "End Time is required",
      validationError: false,
      showModal: this.props.showModal || false,
      toggleModal: this.props.toggleModal,
      eventToEdit: this.props.eventToEdit,
      handleFormSubmit: this.props.handleFormSubmit,
      onRemoveEventClick: this.props.onRemoveEventClick
    };
    this.enableEdit = this.enableEdit.bind(this);
  }

  submitForm = e => {
    e.preventDefault();
    const { date, id, title, description, startTime, endTime } = this.state.eventToEdit;
    this.state.handleFormSubmit({
      id,
      title,
      description,
      date,
      startTime,
      endTime
    });
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
        errorTitleField: !this.state.errorTitleField,
        titleErrormsg: "This field is required"
      })
    } 
    else {
        this.setState({
          errorTitleField: this.state.errorField,
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
    if(t === ""){
      this.setState({
        errorStartTimeField: !this.state.errorStartTimeField,
        startTimeErrorMsg: "Start Time is required"
      })
    } 
    else {
        this.setState({
          errorStartTimeField: this.state.errorStartTimeField,
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
    if(t === ""){
      this.setState({
        errorEndTimeField: !this.state.errorEndTimeField,
        endTimeErrorMsg: "End Time is required"
      })
    } 
    else {
        this.setState({
          errorEndTimeField: this.state.errorEndTimeField,
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
      enableEditing: false
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
    const { title, description, startTime, endTime } = this.state.eventToEdit;
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
            }}
        >
          <div className="paper add-event-modal">
            <center>
              <h2 id="simple-modal-title">Edit Event Data</h2>
            </center>
            <form onSubmit={this.submitForm}>
              <div>
                <TextField
                  disabled={this.state.enableEditing && !this.props.fabPressed}
                  error={this.state.errorTitleField}
                  helperText={this.state.titleIsValid}
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
                  helperText= {this.state.startTimeIsValid} 
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
                  helperText= {this.state.endTimeIsValid}
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
                    disabled= {this.state.errorTitleField && this.state.errorEndTimeField && this.state.errorStartTimeField}
                    style= {{marginRight: "16px"}}
                    variant="contained"
                    color="primary"
                    onClick={this.submitForm}
                  >
                    Save This Event
                  </Button>
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