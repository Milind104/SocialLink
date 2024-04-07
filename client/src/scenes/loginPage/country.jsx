import React from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

class Country extends React.Component {
  constructor(props) {
    super(props);
    this.state = { country: "", region: "" };
  }

  selectCountry(val) {
    this.setState({ country: val });
  }

  selectRegion(val) {
    this.setState({ region: val });
  }

  render() {
    const { country, region } = this.state;
    return (
      <div
        style={{
          gridColumn: "span 4",
          marginBottom: "20px",
        }}
      >
        <CountryDropdown
          value={country}
          onChange={(val) => this.selectCountry(val)}
          style={{ width: "100%", height: "100%" }}
        />
        <RegionDropdown
          country={country}
          value={region}
          onChange={(val) => this.selectRegion(val)}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
}

export default Country;
