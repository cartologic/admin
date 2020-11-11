import React from 'react';
import { PropTypes as T } from 'prop-types';
import IndicatorForm from './IndicatorForm';
import { Link } from 'react-router';

import { csvToJSON, jsonToCSV } from '../utils/csv';
const config = require('../config');
const apiRoot = config.api_root;

class EditIndicator extends React.Component {
  static contextTypes = {
    router: T.object
  }

  constructor (props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount () {
    const component = this;
    const id = component.props.location.pathname
      .replace('/indicators/', '')
      .replace('/edit', '')
    ;

    component.props.auth.request(`${apiRoot}/indicators/${id}`, 'get')
      .then(function (resp) {
        const indicator = resp;
        if (indicator.data && indicator.data.data && typeof indicator.data.data !== 'string') {
          indicator.data.data = jsonToCSV(indicator.data.data);
        }
        component.setState({ indicator, id });
      }).fail(function (err, msg) {
        console.error('error', err, msg);
      });
  }

  handleSubmit ({formData}) {
    const component = this;

    // If there is form data and it doesn't look like a mapbox id
    if (formData.data && !formData.data.match(/^\w+\.\w+$/)) {
      formData.data = csvToJSON(formData.data);
    }

    return component.props.auth.request(`${apiRoot}/indicators/${component.state.id}`, 'put', {
      data: JSON.stringify(formData)
    }).then(function (resp) {
      if (resp.id) {
        component.context.router.push(`/indicators/${resp.id}`);
      }
    }).fail(function (err, msg) {
      console.error('error', err, msg);
    });
  }

  handleDelete () {
    const component = this;
    return component.props.auth.request(`${apiRoot}/indicators/${component.state.id}`, 'delete')
      .then(function (resp) {
        component.context.router.push('/indicators');
      }).fail(function (err, msg) {
        console.error('error', err, msg);
      });
  }

  handleChange (e) {
    // if we have any tabs in the data, replace them with commas
    if (e.formData.data && /\t/.test(e.formData.data)) {
      const newData = Object.assign(this.state.indicator.data,
        { data: e.formData.data.replace(/\t/g, ', ') });
      this.setState({ indicator: Object.assign(this.state.indicator,
        { data: newData }) });
    }
  }

  render () {
    const component = this;
    if (component.state && component.state.indicator) {
      return <div className="wrapper-content width-medium">
        <h1>Edit Indicator</h1>
        <IndicatorForm onSubmit={component.handleSubmit} auth={component.props.auth} formData={component.state.indicator.data} onChange={component.handleChange}>
          <button className="btn button--base button-group" onClick={component.handleDelete}>Delete</button>
          <Link className="btn button--base-bounded button-group" to={`/indicators/${component.state.id}`}>Cancel</Link>
        </IndicatorForm>
      </div>;
    }
    return <div></div>;
  }
}

export default EditIndicator;
