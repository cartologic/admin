/* Add a new Dataset */
import React from 'react';
import { PropTypes as T } from 'prop-types';
import ProjectForm from './ProjectForm';
import {Link} from 'react-router';

let config = require('../config');
let apiRoot = config.api_root;

class NewProject extends React.Component {
  static contextTypes = {
    router: T.object
  }

  constructor (props) {
    if (!['national', 'international'].includes(props.params.type)) {
      throw new Error('Type error');
    }
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit ({formData}) {
    const component = this;
    formData.type = this.props.params.type;
    return this.props.auth.request(`${apiRoot}/projects`, 'post', {
      data: JSON.stringify(formData)
    }).then(function (resp) {
      if (resp.id) {
        component.context.router.push(`/projects/${resp.id}`);
      }
    }).fail(function (err, msg) {
      console.error('error', err, msg);
    });
  }

  render () {
    const component = this;
    return (
      <div className="wrapper-content width-medium">
        <h1 className="text-capitalize">Add a New {this.props.params.type} Project</h1>
        <ProjectForm onSubmit={component.handleSubmit} projectType={component.props.params.type}
                     auth={component.props.auth}>
          <Link className="btn button--base-bounded button-group" to="/">Cancel</Link>
        </ProjectForm>
     </div>
    );
  }
}

export default NewProject;
