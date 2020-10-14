import React from 'react';
import { Link } from 'react-router';
import {schema} from './ProjectForm.js';
import {reverseGovernorateMap, districtLookup} from '../utils/locationNames';

const config = require('../config');
const apiRoot = config.api_root;
const ordering = [
  'name',
  'name_ar',
  'description',
  'description_ar',
  'published',
  'components',
  'project_delays',
  'status',
  'contract_date',
  'planned_start_date',
  'actual_start_date',
  'planned_end_date',
  'actual_end_date',
  'amendments',
  'amendments_ar',
  'number_served',
  'responsible_party',
  'responsible_ministry',
  'implementing_partners',
  'implementing_partners_ar',
  'local_manager',
  'project_file',
  'project_link',
  'percent_complete',
  'sds_indicator',
  'sdg_indicator',
  'category',
  'location',
  'budget',
  'disbursed',
  'kmi',
  'recommendations'
];

const sortOrder = {};
ordering.forEach((item, index) => {
  sortOrder[item] = index;
});

class Project extends React.Component {
  componentWillMount () {
    const component = this;
    const id = component.props.location.pathname.replace('/projects/', '');

    component.props.auth.request(`${apiRoot}/projects/${id}`, 'get')
      .then(function (resp) {
        component.setState({
          project: resp,
          id: id
        });
      }).fail(function (err, msg) {
        console.error('error', err, msg);
      });
  }

  render () {
    const component = this;
    if (component.state && component.state.project) {
      const project = component.state.project.data;
      const keys = schema.properties;
      const rows = Object.keys(project).sort(function (a, b) {
        if (sortOrder[a] < sortOrder[b]) { return -1; }
        if (sortOrder[a] > sortOrder[b]) { return 1; }
        return 0;
      }).filter(key => {
        return key !== 'name';
      }).map(function (key) {
        if (!keys[key]) { return <div key={key}></div>; }
        if (keys[key].type === 'object' && 'ar' in keys[key].properties) {
          return <li key={key}><label>{keys[key].title}</label>{ String(project[key].en) + '-' + String(project[key].ar) }</li>;
        }
        if (keys[key].type === 'string') {
          if(project.type === 'national') {
            if (key === 'project_file' || key === 'reportFile') {
              return <li key={key}><label>{keys[key].title}</label><a href={`${apiRoot}/uploaded/${String(project[key])}`} target='_blank'>{String(project[key])}</a></li>;
            }
          }
          return <li key={key}><label>{keys[key].title}</label>{ String(project[key]) }</li>;
        } else if (key === 'published') {
          return <li key={key}><label>{keys[key].title}</label>{ project[key] ? 'Published' : 'Draft' }</li>;
        } else if (key === 'number_served') {
          const numberServed = project[key].map((item, i) => {
            return (<li key={i} className="preview-item">{item.number_served + ' ' +
            item.beneficiary_type.en + ' - ' + item.beneficiary_type.ar}</li>);
          });
          return <li key={key}><label>{keys[key].title}</label><ul>{numberServed}</ul></li>;
        } else if (key === 'components') {
          // using index in key attribute because array didn't have unique key
          const items = project[key].map((item, i) => <li key={i} className="preview-item">{item.component + ' - ' + item.component_ar}</li>);
          return <li key={key}><label>{keys[key].title}</label><ul>{ items}</ul></li>;
        } else if (key === 'location') {
          const locations = project[key].map((location, i) => {
            let districtObj = location.district;
            let governorateName = null;
            if (districtObj.governorate) {
              governorateName = reverseGovernorateMap[districtObj.governorate];
              if (districtObj.district) {
                let districtName = districtLookup(districtObj.governorate, districtObj.district);
                // using index in key attribute because array didn't have unique key
                return <li key={i} className="preview-item">{districtName + ', ' + governorateName}</li>;
              } else {
                return <li key={i} className="preview-item">{governorateName}</li>;
              }
            }

            return <li key={i}></li>;
          });
          return <li key={key}><label>{keys[key].title}</label><ul>{locations}</ul></li>;
        } else if (key === 'sds_indicator' || key === 'sdg_indicator' || key === 'category') {
          // using index in key attribute because array didn't have unique key
          const indicators = project[key].map((item, i) => <li key={i} className="preview-item">{item.en} - {item.ar}</li>);
          return <li key={key}><label>{keys[key].title}</label><ul>{indicators}</ul></li>;
        } else if (key === 'budget' && project[key].length > 0) {
          // using index in key attribute because array didn't have unique key
          const funds = project[key].map((fund, i) => <li key={i} className="preview-item">{fund.donor.en + ' - ' + fund.donor.ar + ': ' + ' $' + fund.fund.amount}</li>);
          return <li key={key}><label>{keys[key].title}</label><ul>{funds}</ul></li>;
        } else if (key === 'disbursed' && project[key].length > 0) {
          // using index in key attribute because array didn't have unique key
          const disbursed = project[key].map((fund, i) => <li key={i} className="preview-item">{fund.donor.en + ' - ' + fund.donor.ar + ': ' + fund.type.en + ' $' + fund.fund.amount + ' ' + fund.date}</li>);
          return <li key={key}><label>{keys[key].title}</label><ul>{disbursed}</ul></li>;
        } else if (key === 'kmi' && project[key].length > 0) {
          // using index in key attribute because array didn't have unique key
          const kmis = project[key].map((kmi, i) => <li key={i} className='preview-item'>{kmi.activity}<p>{kmi.description}</p><p>{kmi.kpi}</p><p>{kmi.date}</p><p>{kmi.status.en}</p></li>);
          return <li key={key}><label>{keys[key].title}</label><ul>{kmis}</ul></li>;
        }
      });

      return (
        <div className="project-display wrapper-content width-medium">
          <h1 className="header-page-main">{project.name}</h1>
          <Link className="btn button--primary button-section-header" to={`/projects/${component.state.id}/edit`}>Edit</Link>
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

export default Project;
