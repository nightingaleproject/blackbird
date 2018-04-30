import React, { Component } from 'react';

class Validate extends Component {
  render() {
    return (
        <div>
          <h3>Validation</h3>
          <pre>{JSON.stringify(this.props.record, null, 2)}</pre>
        </div>
    );
  }
}

export default Validate;
