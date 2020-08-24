import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import {reverseGovernorateMap, districtLookup} from '../utils/locationNames';

const config = require('../config');
const apiRoot = config.api_root;

class ProjectList extends React.Component {
  static contextTypes = {
    router: T.object
  }

  componentWillMount () {
    const component = this;
    component.props.auth.request(`${apiRoot}/projects/${component.props.type}`, 'get')
      .then(function (resp) {
        let list = resp;
        let sub = component.props.auth.getSub();
        // If we're not the admin filter the list
        if (!component.props.auth.isAdmin()) {
          list = list.filter((project) => {
            return project.owner === sub;
          });
        } if (!component.props.auth.isDomesticEditor()) {
          list = list.filter((project) => {
            return project.owner === sub;
          });
        } if (!component.props.auth.isInternationalEditor()) {
          list = list.filter((project) => {
            return project.owner === sub;
          });
        }

        component.setState({
          list: list
        });
      });
  }

  render () {
    const component = this;
    if (!component.state) {
      return (<div></div>);
    }
    const {list} = component.state;
    list.sort((a, b) => moment(b.created_at) - moment(a.created_at));
    const listItems = list.map((item) => {
      let locations;
      let categories;
      if (item.categories) {
        categories = item.categories.map((obj) => `${obj.en} - ${obj.ar}`);
      }
      if (item.location) {
        locations = item.location.map(l => {
          let districtName = ''; let governorateName = '';
          let retval = '';
          if (l.district.governorate) {
            governorateName = reverseGovernorateMap[l.district.governorate];
            retval += governorateName;

            if (l.district.district) {
              districtName = districtLookup(l.district.governorate, l.district.district);
              retval += (' - ' + districtName);
            }
          }
          return retval;
        }).join(', ');
      }

      return (
        <tr key={item.id}>
          <td><Link to={`/projects/${item.id}`} className="link--primary">{item.name}</Link></td>
          <td>{categories && categories.join(', ')}</td>
          <td>{locations}</td>
          <td>{moment(item.updated_at).format('YYYY-MM-DD')}</td>
          <td>{moment(item.created_at).format('YYYY-MM-DD')}</td>
          <td>{item.published ? '✓' : ''}</td>
        </tr>
      );
    }).filter((item, i) => {
      // filter out items if we have a limit
      return component.props.limit ? i < component.props.limit : true;
    });

    return (
      <div className="section">
        <div className="wrapper-content">
          <h2 className="header-page-main">{ component.props.limit ? 'Recently Added ' : ''}{component.props.type} Projects</h2>
          {component.props.type === 'international' ? (component.props.auth.isInternationalEditor() || component.props.auth.isAdmin()) && <Link to={`projects/${component.props.type}/new`} className="btn button--primary button-section-header button--small">Add a {component.props.type} Project</Link> : (component.props.auth.isDomesticEditor() || component.props.auth.isAdmin()) &&
          <Link to={`projects/${component.props.type}/new`} className="btn button--primary button-section-header button--small">Add a {component.props.type} Project</Link>
          }
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Updated</th>
                <th>Created</th>
                <th>Published</th>
              </tr>
            </thead>
            <tbody>
              {listItems}
            </tbody>
          </table>
          { (component.props.limit && list.length > 0) && // only show view all button if we have a limit
           <Link to='projects' className="link--primary">View All</Link>

          }
        </div>
      </div>
    );
  }
}

export default ProjectList;
