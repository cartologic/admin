import React from 'react';
import Form from 'react-jsonschema-form';

import DataTypeWidget from './widgets/DataTypeWidget';
import ThemeField from './widgets/ThemeField';
import { csvToJSON } from '../utils/csv';
import { transformErrors } from '../utils/nullUtils';

export const schema = {
  type: 'object',
  required: ['name', 'category', 'data', 'units', 'themes'],
  properties: {
    name: {type: 'string', title: 'Indicator Name'},
    name_ar: {type: 'string', title: 'اسم المؤشر'},
    description: {
      title: 'Description',
      type: 'string'
    },
    description_ar: {
      title: 'الوصف',
      type: 'string'
    },
    published: {
      title: 'Visibility - الرؤية',
      type: 'boolean',
      default: false,
      enumNames: ['Published -نشر', 'Draft - مسودة']
    },
    category: {
      title: 'Type of Data - نمط البيانات',
      type: 'string'
    },
    themes: {
      title: 'Theme',
      type: 'array',
      items: {
        type: 'object',
        required: ['type', 'en'],
        properties: {
          type: {title: 'Type of Theme', type: 'string'},
          ar: {type: 'string'},
          en: {type: 'string', title: 'Theme'}
        }
      }
    },
    sources: {
      type: 'array',
      title: 'Sources - المصادر',
      items: {
        type: 'object',
        properties: {
          source: {
            title: 'Source',
            type: 'string'
          },
          source_ar: {
            title: 'المصدر',
            type: 'string'
          }
        }
      }
    },
    units: {
      type: 'string',
      title: 'Unit'
    },
    units_ar: {
      type: 'string',
      title: 'وحدة القياس'
    },
    data_geography: {
      title: 'Data Geography',
      type: 'boolean',
      enumNames: ['Governorate - a2 - محافظة', 'District - a3 - مركز']
    },
    data: {
      type: 'string',
      title: 'Data - البيانات'
    }
  }
};

const validate = function validate (formData, errors) {
  // If there is form data and it doesn't look like a mapbox id
  if (formData.data && !formData.data.match(/^\w+\.\w+$/)) {
    try {
      csvToJSON(formData.data);
    } catch (e) {
      errors.data.addError('Is this a tab separated csv file? Contact an administrator if you\'re having problems adding data');
    }
  }
  return errors;
};

class IndicatorForm extends React.Component {
  onError (errors) {
    console.log(errors);
  }

  render () {
    const uiSchema = {
      name: {
        classNames: 'section-half'
      },
      name_ar: {
        classNames: 'ar section-half section-half-left'
      },
      description: {
        classNames: 'with-ar',
        'ui:widget': 'textarea'
      },
      sources: {
        classNames: 'multiform-group form-block',
        items: {
          classNames: 'multiform-group_item',
          source: {
            classNames: 'with-ar'
          },
          source_ar: {
            classNames: 'ar'
          }
        }
      },
      description_ar: {
        classNames: 'ar',
        'ui:widget': 'textarea'
      },
      category: {
        'ui:field': 'datatype'
      },
      published: {
        'ui:widget': 'radio',
        'ui:disabled': !this.props.auth.isAdmin(),
        classNames: 'section-half'
      },
      private: {
        classNames: 'section-half section-half-left',
        'ui:widget': 'radio'
      },
      units_ar: {
        classNames: 'ar'
      },
      data_geography: {
        'ui:widget': 'radio',
        classNames: 'section-half'
      },
      data: {
        'ui:widget': 'textarea',
        classNames: 'large'
      },
      themes: {
        items: {
          'ui:field': 'themefield'
        }
      }
    };

    return <Form schema={schema}
      onSubmit={this.props.onSubmit}
      onChange={this.props.onChange}
      onError={this.onError.bind(this)}
      formData={this.props.formData}
      uiSchema={uiSchema}
      validate={validate}
      showErrorList={false}
      fields={{
        'datatype': DataTypeWidget,
        'themefield': ThemeField
      }}
      transformErrors={transformErrors}
      showErrorList={false}
    >
      <button type='submit' className='btn button--primary'>Submit</button>
      {this.props.children}
    </Form>;
  }

}

export default IndicatorForm;
