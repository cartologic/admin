import React from 'react';
import Form from 'react-jsonschema-form';
import {cloneDeep, range} from 'lodash';

export const schema = {
  title: 'Project Form',
  type: 'object',
  required: ['name'],
  properties: {
    name: {type: 'string', title: 'Project Name'},
    description: {
      title: 'Objective',
      type: 'string'
    },
    components: {
      title: 'Components',
      type: 'array',
      items: {
        type: 'string'
      }
    },
    amendments: {
      title: 'Project Amendments',
      type: 'string'
    },
    project_delays: {
      title: 'Project Delays',
      type: 'string'
    },
    status: {type: 'string', title: 'Project Status', enum: ['Planned', 'Ongoing', 'Closed']},
    planned_start_date: {type: 'string', title: 'Planned Start Date'},
    actual_start_date: {type: 'string', title: 'Actual Start Date'},
    planned_end_date: {type: 'string', title: 'Planned End Date'},
    actual_end_date: {type: 'string', title: 'Actual End Date'},
    local_manager: {type: 'string', title: 'Local Project Manager'},
    responsible_ministry: {type: 'string', title: 'Responsible Ministry', enum: ['Ministry 1', 'Ministry 2', 'Ministry 3']},
    project_link: {title: 'Project Link', type: 'string', format: 'uri'},
    number_served: {
      type: 'object',
      title: 'Number of Beneficiaries',
      properties: {
        number_served: {type: 'number', title: 'Amount'},
        number_served_unit: {type: 'string', title: 'Unit'}
      }
    },
    sds_indicator: {
      title: 'SDS Goals',
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'SDS Goal 1',
          'SDS Goal 2',
          'SDS Goal 3'
        ]
      }
    },
    sdg_indicator: {
      title: 'SDG Goals',
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'SDG Goal 1',
          'SDG Goal 2',
          'SDG Goal 3'
        ]
      }
    },
    category: {
      type: 'array',
      title: 'Sub-sectors',
      items: {
        type: 'string',
        enum: [
          'Agriculture Extension & Research',
          'Agro-industry, Marketing & Trade',
          'Crops',
          'Fishing, Aquaculture & Forestry',
          'Livestock',
          'Rural Infrastructure & Irrigation'
        ]
      }
    },
    location: {
      title: 'Location',
      type: 'array',
      items: {
        type: 'object',
        required: ['governorate', 'district'],
        properties: {
          governorate: {
            title: 'Governorate',
            type: 'string',
            enum: [
              'governorate 1',
              'governorate 2',
              'governorate 3'
            ]
          },
          district: {
            title: 'District',
            type: 'string',
            enum: [
              'district 1',
              'district 2',
              'district 3'
            ]
          }
        }
      }

    },
    funds: {
      title: 'Funds',
      type: 'array',
      items: {
        type: 'object',
        required: ['amount', 'donor_name', 'type', 'date'],
        properties: {
          amount: {
            type: 'number',
            title: 'Amount'
          },
          donor_name: {
            type: 'string',
            title: 'Donor Name'
          },
          type: {
            type: 'string',
            title: 'Type of Fund',
            enum: ['Loan', 'Grant']
          },
          date: {
            type: 'string',
            title: 'Disbursement Date'
          }

        }
      }
    },
    kmi: {
      title: 'Key Monitoring Indicators',
      type: 'array',
      items: {
        type: 'object',
        required: ['status', 'activity', 'description', 'target', 'kpi', 'date'],
        properties: {
          component: {
            type: 'string',
            title: 'Component',
            enum: []
          },
          status: {
            type: 'string',
            title: 'Status',
            enum: ['Partially Implemented', 'Implemented', 'Not Implemented']
          },
          description: {
            type: 'string',
            title: 'Implementation Description'
          },
          target: {
            type: 'string',
            title: 'Target'
          },
          kpi: {
            type: 'string',
            title: 'KPIs (selected)'
          },
          date: {
            type: 'string',
            title: 'Monitoring Date'
          }
        }
      }
    }
  }
};

  /**
   * Date widget with month & year dropdowns
   */
class DateField extends React.Component {
  constructor (props) {
    super(props);
    if (props.formData) {
      const [year, month] = props.formData.split('/');
      this.state = {month, year};
    } else {
      this.state = {month: -1, year: -1};
    }
  }

  readyForChange () {
    return this.state.month && this.state.year &&
      this.state.month !== -1 && this.state.year !== -1;
  }

  onChange (name) {
    return (event) => {
      this.setState({[name]: event.target.value}, () => {
        if (this.readyForChange()) {
          this.props.onChange(this.state.year + '/' + this.state.month);
        }
      });
    };
  }

  render () {
    const {month, year} = this.state;
    console.log(this.props.schema.title, Number(year), Number(month));
    let months = range(1, 13).map((month) => {
      return <option key={month} value={month}>{month}</option>;
    });
    months.unshift(<option key={-1} value={-1}>month</option>);

    const years = range(1900, 2100).map((year) => {
      return <option key={year} value={year}>{year}</option>;
    });

    years.unshift(<option key={-1} value={-1}>year</option>);

    return <div>
      <label className="control-label">{this.props.schema.title}</label>
      <select className="form-control" value={Number(year)} onChange={this.onChange('year')}>
        {years}
      </select>
      <select className="form-control" value={Number(month)} onChange={this.onChange('month')}>
        {months}
      </select>
    </div>;
  }
}

class ProjectForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {};
    this.state.schema = schema;
    this.state.formData = this.props.formData;
    this.state.uiSchema = {
      name: {
        'ui:placeholder': 'Unique name'
      },
      description: {
        'ui:widget': 'textarea'
      },
      amendments: {
        'ui:widget': 'textarea'
      },
      project_delays: {
        'ui:widget': 'textarea'
      },
      number_served: {
        number_served: {
          'ui:placeholder': '20000'
        },
        number_served_unit: {
          'ui:placeholder': 'Households'
        }
      },
      percent_complete: {
        'ui:widget': 'range'
      },
      planned_start_date: {
        'ui:field': 'short-date'
      },
      actual_start_date: {
        'ui:field': 'short-date'
      },
      planned_end_date: {
        'ui:field': 'short-date'
      },
      actual_end_date: {
        'ui:field': 'short-date'
      },
      project_link: {
        'ui:placeholder': 'http://'
      },
      funds: {
        items: {
          date: {
            'ui:field': 'short-date'
          }
        }
      },
      kmi: {
        items: {
          date: {
            'ui:field': 'short-date'
          },
          description: {
            'ui:widget': 'textarea'
          }
        }
      }
    };
  }

  onChange ({formData}) {
    if (formData.components) {
      const componentEnums = formData.components.filter((component) => {
        return component && component.length > 0;
      });
      if (componentEnums.length > 0) {
        let schema = cloneDeep(this.state.schema);
        schema.properties.kmi.items.properties.component.enum = componentEnums;
        this.setState({schema: schema, formData: formData});
      }
    }
  }

  render () {
    return <Form schema={this.state.schema}
      onSubmit={this.props.onSubmit}
      formData={this.state.formData}
      onChange = {this.onChange.bind(this)}
      fields={{'short-date': DateField}}
      uiSchema = {this.state.uiSchema}
    />;
  }
}

export default ProjectForm;
