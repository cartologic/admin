import React from 'react';
import Form from 'react-jsonschema-form';
import DateFieldFactory from './widgets/DateWidget';
import LocationField from './widgets/LocationWidget';
import CurrencyField from './widgets/CurrencyWidget';
import CustomTextAreaWidget from './widgets/CustomTextAreaWidget';
import CustomTextWidget from './widgets/CustomTextWidget';
import CustomNumberWidget from './widgets/CustomNumberWidget';
import Dropdown from './widgets/Dropdown';
import {setMaybe, transformErrors} from '../utils/nullUtils';
import {sdsLabels, sdgLabels} from '../utils/labels';

export const schema = {
  type: 'object',
  required: [
    'budget',
    'description',
    'category',
    'location',
    'name',
    'number_served',
    'planned_end_date',
    'planned_start_date',
    'published',
    'sdg_indicator',
    'sds_indicator',
    'status'
  ],
  properties: {
    name: {type: 'string', title: 'Project Name', 'description': 'Please make sure this is a unique name'},
    name_ar: {type: 'string', title: 'اسم المشروع', 'description': 'يُرجى التحقق من تخصيص اسم مُميز'},
    description: {
      title: 'Objective',
      type: 'string'
    },
    description_ar: {
      title: 'الهدف',
      type: 'string'
    },
    published: {
      title: 'Visibility - مدى وضوح المشروع', 'description': 'Draft information will be saved but not published on the website - سيتم حفظ معلومات المسودة ولكن لن يتم نشرها على الموقع',
      type: 'boolean',
      default: false,
      enumNames: ['Ready for publishing - جاهز للنشر', 'Draft - مسودة']
    },
    components: {
      title: 'Project Components - (مكونات المشروع (الأهداف المحددة وأنشطة المشروع',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          component: {
            title: 'Component',
            type: 'string'
          },
          component_ar: {
            title: 'المكون',
            type: 'string'
          }
        }
      }
    },
    amendments: {
      title: 'Project Amendments', 'description': 'Please indicate if there have been any major amendments to the project (for example a change in project objective, location, etc.)',
      type: 'string'
    },
    amendments_ar: {
      title: 'تعديلات المشروع', 'description': 'يرجى بيان إذا ما كانت هناك أي تعديلات رئيسية في المشروع (على سبيل المثال تغيير في أهداف المشروع، أو أماكن التنفيذ، وما إلى ذلك)',
      type: 'string'
    },
    project_delays: {
      title: 'Project Delays',
      description: 'Please indicate any major delays in the project implementation, including the  cause of the delay',
      type: 'string'
    },
    project_delays_ar: {
      title: 'حالات التأخير في المشروع', 'description': 'يرجى الإشارة إلى أي تأخيرات كبيرة في تنفيذ المشروع، و يرجى تحديد سبب هذا التأخير',
      type: 'string'
    },
    corrective_action: {
      type: 'string',
      title: 'Corrective Action'
    },
    corrective_action_ar: {
      type: 'string',
      title: 'إجراءات تصحيحية'
    },
    status: {type: 'object', title: 'Project Status - وضع/ حالة المشروع', properties: {en: {type: 'string'}, ar: {type: 'string'}}},
    contract_date: {type: 'string', title: 'Contract Signed - تم توقيع العقد'},
    planned_start_date: {type: 'string', title: 'Planned Start Date - تاريخ البدء (الانطلاق) المُخطط'},
    actual_start_date: {type: 'string', title: 'Actual Start Date - تاريخ البدء (الانطلاق) الفعلي'},
    planned_end_date: {type: 'string', title: 'Planned End Date - تاريخ الانتهاء المُخطط', 'description': 'In case of project delays, extension, or cancellation.'},
    actual_end_date: {type: 'string', title: 'Actual End Date - تاريخ الانتهاء الفعلي', 'description': 'In case of project delays, extension, or cancellation.'},
    local_manager: {type: 'string', title: 'Local Project Manager', 'description': 'Please add the name of the responsible manager at the ministry or national entity'},
    local_manager_ar: {type: 'string', title: 'المدير المحلي للمشروع', 'description': 'يرجى إضافة اسم المدير المسؤول في الوزارة أو الهيئة الوطنية'},
    responsible_ministry: {type: 'object', title: 'Responsible Ministry - الوزارة المسؤولة', properties: {en: {type: 'string'}, ar: {type: 'string'}}},
    implementing_partners: {type: 'string', title: 'Implementing Partners'},
    implementing_partners_ar: {type: 'string', title: 'الشركاء المنفذين'},
    project_link: {title: 'Project Link - الرابط الالكتروني للمشروع', type: 'string', format: 'uri'},
    number_served: {
      type: 'object',
      title: 'Number of Beneficiaries - عدد المستفيدين/ المستفيدات ',
      required: ['number_served', 'number_served_unit'],
      properties: {
        number_served: {type: 'number', title: 'Number - العدد', 'description': 'e.g. 2000'},
        number_served_unit: {type: 'string', title: 'Unit', 'description': 'e.g. Households Served'},
        number_served_unit_ar: {type: 'string', title: 'الفئة', 'description': 'مثال: الاسر المستفيدة'}
      }
    },
    sds_indicator: {
      title: 'SDS Goals - أهداف استراتيجية التنمية المُستدامة',
      type: 'array',
      items: {
        title: 'SDS Goal - هدف استراتيجية التنمية المُستدامة',
        type: 'object',
        required: ['en'],
        properties: {en: {type: 'string', title: 'SDS Indicator'}, ar: {type: 'string'}}
      }
    },
    sdg_indicator: {
      title: 'SDG Goals - أهداف التنمية المستدامة',
      type: 'array',
      items: {
        title: 'SDG Goal - هدف التنمية المستدامة',
        type: 'object',
        required: ['en'],
        properties: {en: {type: 'string', title: 'SDG Indicator'}, ar: {type: 'string'}}
      }
    },
    category: {
      type: 'array',
      title: 'Sub-sectors - القطاعات الفرعية',
      items: {
        title: 'Sub-sector - القطاع الفرعي',
        type: 'object',
        required: ['en'],
        properties: {en: {type: 'string', title: 'Sub-sector'}, ar: {type: 'string'}}
      }
    },
    location: {
      title: 'Locations - النطاق الجغرافي',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          district: {
            type: 'object',
            required: ['governorate'],
            properties: {
              governorate: {
                title: 'Governorate - المحافظة',
                type: 'string'
              },
              district: {
                title: 'District - المركز',
                type: 'string'
              }
            }
          },
          marker: {
            title: 'Location Marker',
            type: 'object',
            properties: {
              lon: {
                title: 'Longitude',
                type: 'number'
              },
              lat: {
                title: 'Latitude',
                type: 'number'
              },
              village: {
                title: 'Village',
                type: 'string'
              }
            }
          }
        }
      }
    },
    budget: {
      title: 'Budget - الميزانية',
      type: 'array',
      items: {
        type: 'object',
        required: ['fund', 'donor_name'],
        properties: {
          fund: {
            type: 'object',
            required: ['currency', 'rate', 'amount', 'original'],
            properties: {
              currency: {type: 'string', title: 'Currency'},
              rate: {type: 'number', title: 'Exchange Rate'},
              amount: {type: 'number', title: 'Amount'},
              original: {type: 'number', title: 'Original Amount'}
            }
          },
          donor_name: {
            type: 'string',
            title: 'Donor or Contributor Name'
          },
          donor_name_ar: {
            type: 'string',
            title: 'الجهة المانحة'
          },
          type: {
            title: 'Type of Fund',
            type: 'object',
            required: ['en'],
            properties: {en: {type: 'string', title: 'Type of Fund'}, ar: {type: 'string'}}
          }
        }
      }
    },
    disbursed: {
      title: 'Disbursed Funds - التمويل الصادر/ المدفوع', 'description': 'Disbursed funds will only be visible to logged in users - المعلومات عن الأموال المصروفة تظهر فقط عند تسجيل الدخول عبر كلمة المرور',
      type: 'array',
      items: {
        type: 'object',
        required: ['fund', 'donor_name', 'type', 'date'],
        properties: {
          fund: {
            type: 'object',
            required: ['currency', 'rate', 'amount', 'original'],
            properties: {
              currency: {type: 'string', title: 'Currency'},
              rate: {type: 'number', title: 'Exchange Rate'},
              amount: {type: 'number', title: 'Amount'},
              original: {type: 'number', title: 'Original Amount'}
            }
          },
          donor_name: {
            type: 'string',
            title: 'Donor Name'
          },
          donor_name_ar: {
            type: 'string',
            title: 'المانح'
          },
          type: {
            title: 'Type of Fund',
            type: 'object',
            required: ['en'],
            properties: {en: {type: 'string', title: 'Type of Fund'}, ar: {type: 'string'}}
          },
          date: {
            type: 'string',
            title: 'Date'
          }
        }
      }
    },
    kmi: {
      title: 'Key Monitoring Indicators - مؤشرات الرصد الرئيسية',
      type: 'array',
      items: {
        type: 'object',
        required: ['status', 'target', 'kpi', 'component'],
        properties: {
          kpi: {
            type: 'string',
            title: 'KPI'
          },
          kpi_ar: {
            type: 'string',
            title: 'مؤشرات الأداء الرئيسية'
          },
          component: {
            title: 'Component',
            type: 'string'
          },
          component_ar: {
            title: 'المكون',
            type: 'string'
          },
          status: {
            title: 'Status',
            type: 'object',
            properties: {en: {type: 'string'}, ar: {type: 'string'}}
          },
          description: {
            type: 'string',
            title: 'Implementation Description'
          },
          description_ar: {
            type: 'string',
            title: 'وصف عملية التنفيذ'
          },
          baseline: {
            type: 'string',
            title: 'Baseline - تقييم خط الأساس'
          },
          current: {
            type: 'string',
            title: 'Current - التقييم الحالي'
          },
          target: {
            type: 'string',
            title: 'Target - الهدف'
          },
          date: {
            type: 'string',
            title: 'Monitoring Date'
          }
        }
      }
    },
    reportLink: {
      type: 'string',
      title: 'Monitoring report link - الرابط الالكتروني لتقرير الرصد',
      format: 'uri'
    },
    recommendations: {type: 'string', title: 'Recommendations based on project experience'},
    recommendations_ar: {type: 'string', title: 'توصيات بناء على خبرة المشروع'}
  }
};
const InternationalSubSectors = {
  'en_sub_sector': [
    'Agriculture Extension & Research',
    'Agro-industry, Marketing & Trade',
    'Crops',
    'Fishing, Aquaculture & Forestry',
    'Livestock',
    'Rural Infrastructure & Irrigation'
  ],
  'ar_sub_sector': [
    'الارشاد الزراعي والبحث',
    'الصناعات الزراعية والتسويق والتجارة',
    'المحاصيل',
    'صيد الأسماك و الزراعة المائية وعلم التحريج',
    'الثروة الحيوانية',
    'البنية التحتية بالمناطق الريفية والري'
  ]
};
const DomesticSubSectors = {
  'en_sub_sector': [
    'Agriculture Extension & Research',
    'Agro-industry, Marketing & Trade',
    'Crops',
    'Fishing, Aquaculture & Forestry',
    'Livestock',
    'Rural Infrastructure & Irrigation'
  ],
  'ar_sub_sector': [
    'الارشاد الزراعي والبحث',
    'الصناعات الزراعية والتسويق والتجارة',
    'المحاصيل',
    'صيد الأسماك و الزراعة المائية وعلم التحريج',
    'الثروة الحيوانية',
    'البنية التحتية بالمناطق الريفية والري'
  ]
};
class ProjectForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.state.schema = schema;
    this.state.formData = this.props.formData;
    if (this.state.formData && 'published' in this.state.formData) {
      this.state.isDraft = !this.state.formData.published;
    } else {
      this.state.isDraft = true;
    }
    // get sub_sectors according to project type
    this.state.subSectors = props.projectType === 'international' ? InternationalSubSectors['en_sub_sector'] : DomesticSubSectors['en_sub_sector'];
    this.state.arabicsubSectors = props.projectType === 'international' ? InternationalSubSectors['ar_sub_sector'] : DomesticSubSectors['ar_sub_sector'];

    this.state.uiSchema = {
      components: {
        classNames: 'multiform-group form-block',
        items: {
          classNames: 'multiform-group_item',
          component: {
            classNames: 'with-ar'
          },
          component_ar: {
            classNames: 'ar'
          }
        }
      },
      category: {
        classNames: 'multiform-group',
        items: {
          classNames: 'multiform-group_item',
          'ui:field': 'select-category'
        }
      },
      status: {
        'ui:field': 'select-status'
      },
      name: {
        classNames: 'section-half'
      },
      name_ar: {
        classNames: 'ar section-half section-half-left'
      },
      implementing_partners: {
        classNames: 'with-ar',
        'ui:field': 'textarea'
      },
      implementing_partners_ar: {
        classNames: 'ar',
        'ui:field': 'textarea'
      },
      description: {
        classNames: 'with-ar',
        'ui:field': 'textarea'
      },
      description_ar: {
        classNames: 'ar',
        'ui:field': 'textarea'
      },
      corrective_action: {
        classNames: 'with-ar'
      },
      corrective_action_ar: {
        classNames: 'ar'
      },
      published: {
        classNames: 'section-half',
        'ui:widget': 'radio'
      },
      private: {
        classNames: 'section-half section-half-left',
        'ui:widget': 'radio'
      },
      amendments: {
        classNames: 'with-ar',
        'ui:field': 'textarea'
      },
      amendments_ar: {
        classNames: 'ar',
        'ui:field': 'textarea'
      },
      project_delays: {
        classNames: 'with-ar',
        'ui:field': 'textarea'
      },
      project_delays_ar: {
        classNames: 'ar',
        'ui:field': 'textarea'
      },
      local_manager: {
        classNames: 'section-half'
      },
      local_manager_ar: {
        classNames: 'ar section-half section-half-left label-lower'
      },
      number_served: {
        classNames: 'field-half form-less-spacing',
        number_served: {
          'ui:field': 'customnumber'
        },
        number_served_unit: {
          classNames: 'padding-right',
          'ui:field': 'customtext'
        },
        number_served_unit_ar: {
          classNames: 'ar form-float-right',
          'ui:field': 'customtext'
        }
      },
      percent_complete: {
        'ui:widget': 'range'
      },
      contract_date: {
        classNames: 'form-extra-spacing',
        'ui:field': 'short-date'
      },
      planned_start_date: {
        classNames: 'form-extra-spacing',
        'ui:field': 'short-date'
      },
      actual_start_date: {
        classNames: 'form-extra-spacing',
        'ui:field': 'short-date'
      },
      planned_end_date: {
        classNames: 'form-extra-spacing',
        'ui:field': 'short-date'
      },
      actual_end_date: {
        classNames: 'form-extra-spacing',
        'ui:field': 'short-date'
      },
      responsible_ministry: {
        'ui:field': 'select-ministry'
      },
      project_link: {
        'ui:placeholder': 'http://'
      },
      location: {
        classNames: 'form-block multiform-group',
        'ui:field': 'location'
      },
      sds_indicator: {
        classNames: 'multiform-group',
        items: {
          classNames: 'multiform-group_item',
          'ui:field': 'select-sds_indicator'
        }
      },
      sdg_indicator: {
        classNames: 'multiform-group',
        items: {
          classNames: 'multiform-group_item',
          'ui:field': 'select-sdg_indicator'
        }
      },
      budget: {
        classNames: 'form-block columns-small multiform-group',
        items: {
          fund: {'ui:field': 'currency'},
          type: {'ui:field': 'select-disbursed-type'},
          donor_name: {
            classNames: 'with-ar'
          },
          donor_name_ar: {
            classNames: 'ar'
          }
        }
      },
      disbursed: {
        classNames: 'form-block columns-small multiform-group',
        items: {
          fund: {'ui:field': 'currency'},
          date: {'ui:field': 'fund-date'},
          type: {'ui:field': 'select-disbursed-type'},
          donor_name: {
            classNames: 'with-ar'
          },
          donor_name_ar: {
            classNames: 'ar'
          }
        }
      },
      kmi: {
        classNames: 'form-block multiform-group',
        items: {
          date: {
            'ui:field': 'monitoring-date'
          },
          kpi: {
            classNames: 'with-ar'
          },
          kpi_ar: {
            classNames: 'ar'
          },
          status: {
            'ui:field': 'select-kmi_status'
          },
          description: {
            'ui:field': 'textarea',
            classNames: 'with-ar'
          },
          component: {
            classNames: 'with-ar'
          },
          component_ar: {
            classNames: 'ar'
          },
          description_ar: {
            'ui:field': 'textarea',
            classNames: 'ar'
          }
        }
      },
      reportLink: {
        title: 'Report link',
        'ui:placeholder': 'http://'
      },
      recommendations: {
        classNames: 'with-ar',
        'ui:field': 'textarea'
      },
      recommendations_ar: {
        classNames: 'ar',
        'ui:field': 'textarea'
      }
    };
  }

  onChange ({formData}) {
    let isDraft;
    if (formData && 'published' in formData) {
      isDraft = !formData.published;
    }
    formData = setMaybe(this.state.schema, formData);
    this.setState({
      isDraft,
      formData
    });
  }

  onError () {
    window.scrollTo(0, 0);
  }

  ErrorList (props) {
    const errors = transformErrors(props.errors);

    return (
      <ul className="error-list bs-callout bs-callout-info">
        <p className="text-danger control-label"><b>There are errors in the form:</b></p>
        {errors.map((error, i) => {
          return (
            <li key={i} className="text-danger">
              {error.message}
            </li>
          );
        })}
      </ul>
    );
  }

  onSubmit (formObject) {
    let {formData} = formObject;
    formData = setMaybe(this.state.schema, formData);
    this.props.onSubmit(Object.assign({}, formObject, {formData}));
  }

  render () {
    const {schema, formData, isDraft, subSectors, arabicsubSectors} = this.state;
    return <Form schema={schema}
      onSubmit={this.onSubmit.bind(this)}
      formData={formData}
      onChange={this.onChange.bind(this)}
      noValidate={isDraft}
      onError={this.onError.bind(this)}
      ErrorList={this.ErrorList.bind(this)}
      fields={{
        'short-date': DateFieldFactory('Year - عام', 'Month - شهر'),
        'fund-date': DateFieldFactory('Year Disbursed - تاريخ الصرف (عام)؛', 'Month Disbursed - تاريخ الصرف (شهر)؛'),
        'monitoring-date': DateFieldFactory('Monitoring Date (Year) - تاريخ الرصد (عام)؛', 'Monitoring Date (Month) - تاريخ الرصد (شهر)؛'),
        'location': LocationField,
        'textarea': CustomTextAreaWidget,
        'customtext': CustomTextWidget,
        'customnumber': CustomNumberWidget,
        'currency': CurrencyField,
        'select-status': Dropdown(
          'Project Status - وضع/ حالة المشروع',
          'Select a status - يُرجى اختيار وضع محدد (حالة محددة)',
          [
            'Planned',
            'Ongoing',
            'Closed'
          ],
          [
            'مُخطط',
            'جاري/ مستمر',
            'مُغلق'
          ]
        ),
        'select-ministry': Dropdown('Responsible Ministry - الوزارة المسؤولة', 'Select a Ministry',
          [
            'Ministry of Agriculture and Land Reclamation',
            'Ministry of International Cooperation and Investment',
            'Ministry of Environment – Egyptian Environment Affairs Agency',
            'Ministry of Water Resources and Irrigation',
            'Ministry of Trade and Industry',
            'General Authority For Fish Resources Development'
          ],
          [
            'وزارة الزراعة واستصلاح الأراضي',
            'وزارة الاستثمار و التعاون الدولى',
            'وزارة البيئة - جهاز شئون البيئة',
            'وزارة الموارد المائية والراي',
            'وزارة التجارة والصناعة',
            'الهيئة العامة لتنمية الثروة السمكية'
          ]
        ),
        'select-sds_indicator': Dropdown(
          'SDS Goal - هدف استراتيجية التنمية المُستدامة',
          sdsLabels.select,
          sdsLabels.en,
          sdsLabels.ar,
          true
        ),
        'select-sdg_indicator': Dropdown(
          'SDG Goal - هدف التنمية المستدامة',
          sdgLabels.select,
          sdgLabels.en,
          sdgLabels.ar,
          true
        ),
        'select-category': Dropdown(
          'Sub-sector - القطاع الفرعي',
          'Select a sub-sector - يُرحى اختيار قطاع فرعي',
          subSectors,
          arabicsubSectors,
          true
        ),
        'select-disbursed-type': Dropdown(
          'Type of Fund',
          'Select type of fund',
          ['Loan', 'Grant', 'Local Contribution'],
          ['قرض', 'منحة', 'مساهمة محلية']
        ),
        'select-kmi_status': Dropdown('Status', 'Select a status - يُرجى اختيار الوضع/ الحالة',
          ['Not Implemented', 'Partially Implemented', 'Implemented', 'N/A'],
          ['لم يتحقق', ' تحقق جزئياً', ' تحقق بالكامل', 'N/A']
        )
      }}
      uiSchema = {this.state.uiSchema}
      transformErrors={transformErrors}
      showErrorList={true}
    >

      <button type='submit' className='btn button--primary'>Submit</button>
      {this.props.children}
    </Form>;
  }
}

export default ProjectForm;
