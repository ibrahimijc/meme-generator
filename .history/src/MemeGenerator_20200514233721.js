import React, { Component } from "react";
import axios from "axios";

class MemeGenerator extends Component {
  constructor() {
    super();

    this.state = {
      toptext: "",
      bottomtext: "",
      randimg: "http://i.imgflip.com/1bij.jpg",
      t_id: 61579,
      dispayH2: true,
      allMemes: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateRandom = this.generateRandom.bind(this);
    this.updateId = this.updateId.bind(this);
  }

  encodeForm(data) {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");
  }

  componentDidMount() {
    axios.get("https://api.imgflip.com/get_memes").then((response) => {
      const { memes } = response.data.data;

      this.setState({ allMemes: memes });
    });
  }

  updateId(value) {
    const img = value;
    const meme = this.state.allMemes.find((meme) => meme.url === img);

    this.setState((prevState) => {
      return { t_id: meme.id };
    });
  }

  handleChange(event) {
    const { name, value, type } = event.target;

    this.setState({ [name]: value });

    if (type === "select-one") this.updateId(value);
  }

  generateRandom() {
    this.setState({ dispayH2: true });

    let randNumber = Math.floor(Math.random() * this.state.allMemes.length);
    let tempImage = this.state.allMemes[randNumber].url;
    let value = this.state.allMemes[randNumber].id;
    this.setState({
      randimg: tempImage,
      t_id: value,
    });
  }
  handleSubmit() {
    this.setState({ dispayH2: false });
    let data = {
      username: process.env.REACT_APP_USERNAME,
      password: process.env.REACT_APP_PASSWORD,
      template_id: this.state.t_id,
      text0: this.state.toptext,
      text1: this.state.bottomtext,
    };

    axios
      .post("https://api.imgflip.com/caption_image", this.encodeForm(data), {
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        this.setState({ randimg: response.data.data.url });
      })
      .catch((error) => {
        if (error.response) {
          console.log("response error", error.response);
        } else if (error.request) {
          console.log("req errir", error.request);
        } else console.log("Error", error);
      });
  }
  render() {
    const memeSelect = this.state.allMemes.map((meme) => {
      return (
        <option memeid={meme.id} value={meme.url}>
          {meme.name}
        </option>
      );
    });

    return (
      <div>
        <form className="meme-form">
          <select
            name="randimg"
            //value={this.state.randimg}
            onChange={this.handleChange}
          >
            {memeSelect}
          </select>
          <input
            name="toptext"
            type="text"
            placeholder="Top Text"
            onChange={this.handleChange}
            value={this.state.toptext}
          ></input>
          <input
            name="bottomtext"
            type="text"
            placeholder="Bottom Text"
            onChange={this.handleChange}
            value={this.state.bottomtext}
          ></input>
          <button type="button" onClick={this.generateRandom}>
            Random
          </button>
          <p> </p> <hr></hr>
          <button
            disabled={!this.state.toptext || !this.state.bottomtext}
            type="button"
            onClick={this.handleSubmit}
          >
            Caption
          </button>
        </form>

        <div className="meme">
          <img src={this.state.randimg} alt="" />
        </div>
      </div>
    );
  }
}

export default MemeGenerator;
