import React from 'react';
import { Link } from 'react-router';
import {schema} from './IndicatorForm.js';

import { jsonToCSV } from '../utils/csv';
const config = require('../config');
const apiRoot = config.api_root;
const ordering = [
  'name',
  'description',
  'published',
  'private',
  'sources',
  'units',
  'data'
];

const sortOrder = {};
ordering.forEach((item, index) => {
  sortOrder[item] = index;
});

class Indicator extends React.Component {
  componentWillMount () {
    const component = this;
    const id = component.props.location.pathname.replace('/indicators/', '');

    component.props.auth.request(`${apiRoot}/indicators/${id}`, 'get')
      .then(function (resp) {
        component.setState({
          indicator: resp,
          id: id
        });
      }).fail(function (err, msg) {
        console.error('error', err, msg);
      });
  }

  render () {
    const component = this;
    if (component.state && component.state.indicator) {
      const indicator = component.state.indicator.data;
      const keys = schema.properties;
      const rows = Object.keys(indicator).sort(function (a, b) {
        if (sortOrder[a] < sortOrder[b]) { return -1; }
        if (sortOrder[a] > sortOrder[b]) { return 1; }
        return 0;
      }).filter(key => {
        return key !== 'name';
      }).map(function (key) {
        if (!keys[key]) return <div></div>;
        if (keys[key].type === 'object' && typeof indicator[key] === 'object' && 'ar' in indicator[key]) {
          return <li key={key}><label>{keys[key].title}</label>{indicator[key].en} - {indicator[key].ar}</li>;
        }
        if (key === 'data' && indicator[key]) {
          const displayData = jsonToCSV(indicator[key]);
          return (<li key={key} className='large'>
            <label>{keys[key].title}</label>
            <textarea className='form-control' readOnly value={displayData}></textarea>
          </li>);
        } else if (key === 'published') {
          return <li key={key}><label>{keys[key].title}</label>{ indicator[key] ? 'Published' : 'Draft' }</li>;
        } else if (keys[key].type === 'string') {
          return <li key={key}><label>{keys[key].title}</label>{ String(indicator[key]) }</li>;
        }
      });

      return (
        <div className="indicator-display wrapper-content width-medium">
          <h1 className="header-page-main">{indicator.name}</h1>
          <Link className="btn button--primary button-section-header" to={`/indicators/${component.state.id}/edit`}>Edit</Link>
          <ul>
            { rows }
          </ul>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default Indicator;
