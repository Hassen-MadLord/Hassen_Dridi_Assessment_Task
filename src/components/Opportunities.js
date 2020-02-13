import React from "react";
import "../css/Opportunity.css";

var test = "";

export default class Opportunity extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      isLoading: false,
    };
  }

  UNSAFE_componentWillMount() {
    localStorage.getItem("items") &&
      this.setState({
        items: JSON.parse(localStorage.getItem("items")),
        isLoading: false
      });
  }

  componentDidMount() {
    const date = localStorage.getItem("itemsDate");
    const itemsDate = date && new Date(parseInt(date));
    const now = new Date();
    const dataAge = Math.round((now - itemsDate) / (9000000000000000000000 * 60)); // in minutes
    const oldData = dataAge >= 1;

    if (localStorage.items && (localStorage.items.length == 2||oldData)) {
      this.getItems();
    } else {
      // console.log(`Using data from localStorage that are ${dataAge} minutes old.`);
    }

    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const user = rememberMe ? localStorage.getItem("user") : "";
    this.setState({ user, rememberMe });
  }

  getItems() {
    this.setState({
      isLoading: true,
      items: []
    });

    //TODO:getting the API
    const url =
      "http://api-staging.aiesec.org/v2/opportunities/favourite?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c";
    fetch(url)
      .then(data => data.json())
      .then(parsedJSON =>
        //TODO:mapping the API data and specific item to use later on
        parsedJSON.map(item => ({
          id: `${item.id}`,
          name: `${item.title}`,
          img: `${item.cover_photo_urls}`,
          location: `${item.location}`,
          startedDate: `${item.earliest_start_date}`,
          duration: `${item.duration}`,
          organizationImage: `${item.profile_photo_urls.medium}`,
          organizationDescrip: `${item.branch.organisation.summary}`,
          sdg: `${item.programmes.id}`,
          product: `${item.programmes.short_name}`,
          applicant: `${item.applications_count}`
        }))
      )
      .then(items =>
        this.setState({
          items,
          isLoading: false
        })
      )
      .catch(error => console.log("parsing failed", error));
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    localStorage.setItem("items", JSON.stringify(nextState.items));
    localStorage.setItem("itemsDate", Date.now());
  }

  //Here you can update the project name
  title = (id, event) => {
    if (event.target.value.length === 0) {
      return;
    }
    const index = this.state.items.findIndex(item => {
      return item.id === id;
    });

    const test = Object.assign({}, this.state.items[index]);
    test.name = event.target.value;

    const items = Object.assign([], this.state.items);
    items[index] = test;

    this.setState({ items: items });
  };

  description = (id, event) => {
    if (event.target.value.length === 0) {
      return;
    }
    const index = this.state.items.findIndex(item => {
      return item.id === id;
    });

    const test = Object.assign({}, this.state.items[index]);
    test.organizationDescrip = event.target.value;

    const items = Object.assign([], this.state.items);
    items[index] = test;

    this.setState({ items: items });
  };

  handleFormSubmit = () => {
    const { items } = this.state;
    localStorage.setItem("items", JSON.stringify(items));
  };

  handleClick(e, item) {
    // console.log(item);
  }

  render() {
    let handleClick = this.handleClick;
    let handleFormSubmit = this.handleFormSubmit;
    let title = this.title;
    let description = this.description;
    let items = this.state.items;
    if (this.state.isLoading) {
      return (
        <div
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%' }}
        >
          <div className="loader"></div>
        </div>
      );
    }

    return (
      <div className="app">
        <div>
          {this.state.items.map(function(item, index) {
            return (
              <div
                key={item.id}
                _ngcontent-c19=""
                className="aiesec-image-tile position-relative hoverable ng-tns-c19-2 ng-star-inserted"
              >
                <button
                  type="button"
                  className="edit_btn"
                  data-toggle="modal"
                  class="btn btn-primary"
                  data-target="#exampleModalCenter"
                  onClick={e => handleClick(e, (test = item))}
                >
                  edit
                </button>

                <div
                  className="modal fade"
                  style={{ zIndex: 9999 }}
                  id="exampleModalCenter"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalCenterTitle"
                  aria-hidden="true"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">
                          Update Project - {test.id}
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <form style={{ textAlign: "center" }} onSubmit={handleFormSubmit}>
                        <label>
                          <input
                            style={{
                              width: 380,
                              height: 30,
                              marginBottom: 5
                            }}
                            placeholder="Title"
                            defaultValue={test.name}
                              // defaultValue={items.filter(item => item.name == items.name)}

                            onChange={title.bind(this, test.id)}
                          />
                        </label>
                        <br />
                        <input
                          style={{
                            width: 420,
                            paddingBottom: 100,
                            borderRadius: 2
                          }}
                          placeholder="Description"
                          defaultValue={test.organizationDescrip}
                          onChange={description.bind(this, test.id)}
                        />
                        <div className="modal-footer">
                          <button type="submit" className="btn btn-primary">
                            Save changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div
                  _ngcontent-c19=""
                  id="aiesec-image-tile__wrapper"
                  key={index}
                >
                  <img
                    _ngcontent-c19=""
                    className="tile-image"
                    src={item.img}
                    alt=""
                  />
                  <img
                    _ngcontent-c19=""
                    className="tile-image-tag"
                    src={
                      "https://aiesec.org/assets/images/" +
                      `${item.product.toLowerCase()}` +
                      "-logo-long.svg"
                    }
                  />
                </div>
                <div _ngcontent-c19="" className="right-box wd-100 ml-4">
                  <div
                    _ngcontent-c19=""
                    className="display-flex justify-content-between"
                  >
                    <div
                      _ngcontent-c19=""
                      className="text-color-1"
                      style={{ width: 550 }}
                    >
                      <b
                        _ngcontent-c19=""
                        style={{
                          color: "#272727",
                          textTransform: "capitalize",
                          marginLeft: -20                        
                        }}
                        className="ng-tns-c19-2"
                      >
                        {item.name}
                      </b>
                    </div>
                  </div>
                  <p
                    _ngcontent-c19=""
                    className="tile-desc-text mt-1"
                  >
                    <span _ngcontent-c19="" className="mr-2">
                      {item.location}
                    </span>
                    <span _ngcontent-c19="" className="mr-2 dot"></span>
                    <span _ngcontent-c19="" className="mr-2">
                      {item.startedDate}
                    </span>
                    <span _ngcontent-c19="" className="mr-2 dot"></span>
                    <span _ngcontent-c19="" className="mr-2">
                      {item.duration} weeks
                    </span>
                  </p>
                  <div
                    _ngcontent-c19=""
                    className="display-flex justify-content-between mt-1 mb-2"
                  >
                    <span style={{marginLeft: -20, position: 'absolute'}} _ngcontent-c19="" className="tile-desc-text">
                      <img
                        _ngcontent-c19=""
                        className="company-image mr-1 ng-tns-c19-2 ng-star-inserted"
                        src={
                          "https://cdn-expa.aiesec.org/gis-img/missing_profile_" +
                          `${item.name.charAt(0).toLowerCase()}` +
                          ".svg"
                        }
                        style={{ marginRight: 2 }}
                        alt=""
                      />{" "}
                      {item.name}{" "}
                    </span>
                    <div
                      _ngcontent-c19=""
                      className="d-flex ng-tns-c19-2 ng-star-inserted"
                    >
                      <div
                        _ngcontent-c19=""
                        className="tile-desc-text fs-12 ml-3"
                        style={{position: 'absolute', right: 0}}
                      >
                        <i className="fa fa-user"></i> {item.applicant}{" "}
                        applicant{" "}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 20,
                          width: 215
                        }}
                      >
                        <p style={{marginLeft: '60%', width: '100%'}}>{item.organizationDescrip}</p>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          width: 215
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
