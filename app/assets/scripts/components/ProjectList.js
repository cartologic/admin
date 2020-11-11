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
        if (!(component.props.auth.isAdmin() || component.props.auth.isInternationalReviewer()
            // eslint-disable-next-line operator-linebreak
            || component.props.auth.isNationalReviewer())) {
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
    list.sort((a, b) => a.name < b.name ? -1 : 1);
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
    const {auth, type, limit} = component.props;
    return (
      <div className="section">
        <div className="wrapper-content">
          <h2 className="header-page-main">{ limit ? 'Recently Added ' : ''}{type[0].toUpperCase() + type.substring(1)} Projects</h2>
          {type === 'international' ? (auth.isInternationalEditor() || auth.isAdmin()) && <Link to={`projects/${type}/new`} className="btn button--primary button-section-header button--small text-capitalize">Add a {type[0].toUpperCase() + type.substring(1)} Project</Link> : (auth.isNationalEditor() || auth.isAdmin()) &&
          <Link to={`projects/${type}/new`} className="btn button--primary button-section-header button--small text-capitalize">Add a {type[0].toUpperCase() + type.substring(1)} Project</Link>
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
          { (limit && list.length > limit) && // only show view all button if we have a limit
           <Link to={`projects/${type}`} className="link--primary">View All</Link>
          }
        </div>
      </div>
    );
  }
}

export default ProjectList;
