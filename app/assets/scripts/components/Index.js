import React from 'react';

import ProjectList from './ProjectList';
import IndicatorList from './IndicatorList';

class Index extends React.Component {

  render () {
    return (
      <div>
        {(this.props.auth.isInternationalEditor() || this.props.auth.isAdmin()) && <ProjectList auth={this.props.auth} type={'international'} limit={5} />}
        {(this.props.auth.isDomesticEditor() || this.props.auth.isAdmin()) && <ProjectList auth={this.props.auth} type={'domestic'} limit={5} />}
        <IndicatorList auth={this.props.auth} limit={5} />
      </div>
    );
  }
}

export default Index;
