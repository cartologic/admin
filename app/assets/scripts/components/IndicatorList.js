import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router';
import moment from 'moment';
import { sortBy } from 'lodash';

const config = require('../config');
const apiRoot = config.api_root;

class IndicatorList extends React.Component {
  static contextTypes = {
    router: T.object
  }

  componentWillMount () {
    const component = this;
    component.props.auth.request(`${apiRoot}/indicators`, 'get')
      .then(function (resp) {
        let list = resp;
        let sub = component.props.auth.getSub();
        // If we're not the admin filter the list
        if (!(component.props.auth.isAdmin() || component.props.auth.isIndicatorReviewer())) {
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
    let { list } = component.state;
    list = sortBy(list, [o => o.name.toLowerCase(), o => moment(o.created_at)]); // Sort by na,e, then created_at
    const listItems = list.map((item) => {
      let categories;
      if (item.theme) {
        categories = item.theme.map((obj) => `${obj.en} - ${obj.ar}`);
      }
      return (
        <tr key={item.id}>
        <td><Link to={`/indicators/${item.id}`} className="link--primary">{item.name}</Link></td>
        <td>{categories && categories.join(', ')}</td>
        <td>{moment(item.updated_at).format('YYYY-MM-DD')}</td>
        <td>{moment(item.created_at).format('YYYY-MM-DD')}</td>
        <td>{item.published ? '✓' : ''}</td>
        </tr>
      );
    }).filter((item, i) => {
      // filter out items if we have a limit
      return component.props.limit ? i < component.props.limit : true;
    });
    const {auth, limit} = component.props;

    return (
      <div className="section">
        <div className="wrapper-content">
          <h2 className="header-page-main">{ component.props.limit ? 'Recently Added ' : ''}Indicators</h2>
          {(auth.isIndicatorEditor() || auth.isAdmin()) && <Link to='indicators/new' className="btn button--primary button-section-header button--small text-capitalize">Add an Indicator</Link>}
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
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
             <Link to='indicators' className="link--primary">View All</Link>
          }
        </div>
      </div>
    );
  }
}

export default IndicatorList;
