import React from 'react';
import { PropTypes as T } from 'prop-types';
import ProjectForm from './ProjectForm';
import { Link } from 'react-router';

const config = require('../config');
const apiRoot = config.api_root;

class EditProject extends React.Component {
  static contextTypes = {
    router: T.object
  }

  constructor (props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  fileBase64 (file, fileName) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        var fileInfo = reader.result.split(',')[0].split(';');
        var header = `${fileInfo[0]};name=${fileName};${fileInfo[1]}`;
        resolve(`${header},${reader.result.split(',')[1]}`);
      };
      reader.onerror = function(error) {
        reject(error);
      };
    });
  }



  componentWillMount () {
    const component = this;
    const id = component.props.location.pathname
      .replace('/projects/', '')
      .replace('/edit', '');
    component.props.auth.request(`${apiRoot}/projects/${id}`, 'get')
        .then(function (resp) {
        
              component.setState({project: resp, id: id });
          
        }).fail(function (err, msg) {
          console.error('error', err, msg);
        });
  }

  handleSubmit ({formData}) {
    const component = this;
    return component.props.auth.request(`${apiRoot}/projects/${component.state.id}`, 'put', {
      data: JSON.stringify(formData)
    }).then(function (resp) {
      if (resp.id) {
        component.context.router.push(`/projects/${resp.id}`);
      }
    }).fail(function (err, msg) {
      console.error('error', err, msg);
    });
  }

  handleDelete (e) {
    e.preventDefault(); // to prevent form submission
    const component = this;
    return component.props.auth.request(`${apiRoot}/projects/${component.state.id}`, 'delete')
      .then(function (resp) {
        component.context.router.push(`/projects/${component.state.project.type}`);
      }).fail(function (err, msg) {
        console.error('error', err, msg);
      });
  }

  render () {
    const component = this;
    if (component.state && component.state.project) {
      return <div className="wrapper-content width-medium">
        <h1>Edit Project</h1>
        <ProjectForm onSubmit={component.handleSubmit} formData={component.state.project.data}
                     projectType={component.state.project.type} auth={component.props.auth}>
          <button className="btn button--base button-group" onClick={component.handleDelete}>Delete</button>
          <Link className="btn button--base-bounded button-group" to={`/projects/${component.state.id}`}>Cancel</Link>
        </ProjectForm>
      </div>;
    }
    return <div></div>;
  }
}

export default EditProject;
