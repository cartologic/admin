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
import {sdsLabels, sdgLabels, fundLabelsInter, fundLabelsNational, donors, beneficiaryTypes} from '../utils/labels';

export const schema = {
  type: 'object',
  required: [
    'budget',
    'description',
    'description_ar',
    'category',
    'location',
    'name',
    'name_ar',
    'number_served',
    'contract_date',
    'planned_end_date',
    'planned_start_date',
    'published',
    'sdg_indicator',
    'sds_indicator',
    'status',
    'components'
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
      title: 'Visibility - الرؤية', 'description': 'Draft information will be saved but not published on the website - سيتم حفظ معلومات المسودة ولكن لن يتم نشرها على الموقع',
      type: 'boolean',
      default: false,
      enumNames: ['Publish - نشر', 'Draft - مسودة']
    },
    components: {
      title: 'Project Components - (مكونات المشروع (الأهداف المحددة وأنشطة المشروع',
      type: 'array',
      items: {
        type: 'object',
        required: ['component', 'component_ar'],
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

    project_delays: {
      title: 'Project Delays',
      description: 'Please indicate any major delays in the project implementation, including the  cause of the delay',
      type: 'string'
    },
    project_delays_ar: {
      title: 'حالات التأخير في تنفيذ المشروع', 'description': 'يرجى الإشارة إلى أي تأخيرات كبيرة في تنفيذ المشروع، و يرجى تحديد سبب هذا التأخير',
      type: 'string'
    },
    date_delay_occurrence: {type: 'string', title: 'Date Of Delay Occurrence - تاريخ حالة التأخير'},
    corrective_action: {
      type: 'string',
      title: 'Project Amendments or Corrective Action'
    },
    corrective_action_ar: {
      type: 'string',
      title: 'تعديلات المشروع أو الإجراءات التصحيحية'
    },
    date_corrective_action: {type: 'string', title: 'Date Of Corrective Action -  تاريخ تنفيذ الإجراء التصحيحى'},
    treat_corrective_action: {
      type: 'string',
      title: 'How did the corrective action remedy the delay encountered ?'
    },
    treat_corrective_action_ar: {
      type: 'string',
      title: 'كيف عالج الإجراء التصحيحى التأخير الذى واجهه المشروع'
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
    project_file: {title: 'Project File -  ملف المشروع', type: 'string', format: 'uri'},
    number_served: {
      title: 'Number of Beneficiaries - عدد المستفيدين/ المستفيدات ',
      type: 'array',
      items: {
        type: 'object',
        required: ['number_served', 'beneficiary_type'],
        properties: {
          number_served: {type: 'number', title: 'Number - العدد'},
          beneficiary_type: {
            title: 'Unit - الفئة',
            type: 'object',
            required: ['en'],
            properties: {en: {type: 'string', title: 'Unit'}, ar: {type: 'string'}}
          }
        }
      }
    },
    sds_indicator: {
      title: 'SDS Pillars - أهداف استراتيجية التنمية المُستدامة',
      type: 'array',
      items: {
        title: 'SDS Pillars - هدف استراتيجية التنمية المُستدامة',
        type: 'object',
        required: ['en'],
        properties: {en: {type: 'string', title: 'SDS Indicator'}, ar: {type: 'string'}}
      }
    },
    sdg_indicator: {
      title: 'SDGs - أهداف التنمية المستدامة',
      type: 'array',
      items: {
        title: 'SDGs - هدف التنمية المستدامة',
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
        required: ['fund', 'donor'],
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
          donor: {
            title: 'Donor or Contributor Name - الجهة المانحة',
            type: 'object',
            required: ['en'],
            properties: {en: {type: 'string', title: 'Donor or Contributor Name'}, ar: {type: 'string'}}
          },
          type: {
            title: 'Type of Fund',
            type: 'object',
            required: ['en'],
            properties: {en: {type: 'string', title: 'Type of Fund'}, ar: {type: 'string'}}
          },
          loan_details: {
            description: 'Loan Details (ONLY ADD FOR LOANS) - (تفاصيل القرض (في حالة القروض فقط',
            type: 'object',
            properties: {
              interest_rate: {type: 'number', title: 'Interest Rate - سعر الفائدة'},
              grace_period: {type: 'number', title: 'Grace Period - فترة السداد'},
              number_of_installments: {type: 'number', title: 'Number Of Installments - عدد الاقساط'},
              duration_of_repayment_en: {type: 'string', title: 'Duration of Repayment'},
              duration_of_repayment_ar: {type: 'string', title: 'مدة السداد'}
            }
          }
        }
      }
    },
    disbursed: {
      title: 'Disbursed Funds - التمويل الصادر/ المدفوع', 'description': 'Disbursed funds will only be visible to logged in users - المعلومات عن الأموال المصروفة تظهر فقط عند تسجيل الدخول عبر كلمة المرور',
      type: 'array',
      items: {
        type: 'object',
        required: ['fund', 'donor', 'type', 'date'],
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
          donor: {
            title: 'Donor or Contributor Name - الجهة المانحة',
            type: 'object',
            required: ['en'],
            properties: {en: {type: 'string', title: 'Donor or Contributor Name'}, ar: {type: 'string'}}
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
      title: 'Key Performance Indicators - مؤشرات الرصد الرئيسية',
      type: 'array',
      items: {
        type: 'object',
        required: ['status', 'target', 'kpi', 'component'],
        properties: {
          component: {
            title: 'Component',
            type: 'string'
          },
          component_ar: {
            title: 'المكون',
            type: 'string'
          },
          kpi: {
            type: 'string',
            title: 'Key Performance Indicator'
          },
          kpi_ar: {
            type: 'string',
            title: 'مؤشر الأداء الرئيسى'
          },
          status: {
            title: 'Status',
            type: 'object',
            properties: {en: {type: 'string'}, ar: {type: 'string'}}
          },
          baseline: {
            type: 'string',
            title: 'Baseline - تقييم خط الأساس'
          },
          target: {
            type: 'string',
            title: 'Target - الهدف'
          },
          current: {
            type: 'string',
            title: 'Achieved - التقييم الحالي'
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
    reportFile: {
      type: 'string',
      title: 'Monitoring report file -   ملف تقرير الرصد',
      format: 'uri'
    },
    recommendations: {type: 'string', title: 'Project achievements and Recommendations based on project experience'},
    recommendations_ar: {type: 'string', title: ' إنجازات المشروع و توصيات بناء على خبرة المشروع'}
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
    'الإرشاد الزراعي والبحث',
    'الصناعات الزراعية والتسويق والتجارة',
    'المحاصيل',
    'صيد الأسماك و الزراعة المائية و التحريج',
    'الثروة الحيوانية',
    'البنية التحتية بالمناطق الريفية والري'
  ]
};
const NationalSubSectors = {
  'en_sub_sector': [
    'Minister\'s Office Affairs',
    'Agricultural Services and Monitoring',
    'Agricultural Extension',
    'Livestock, Fisheries, and Poultry',
    'Land Reclamation',
    'Economic Affairs',
    'Financial and Administrative Affairs',
    'Executive Agency for Comprehensive Development Projects (EACDP)'
  ],
  'ar_sub_sector': [
    'قطاع مكتب الوزير',
    'قطاع الخدمات والمتابعة',
    'قطاع الارشاد الزراعي',
    'قطاع تنمية الثروة الحيوانية والسمكية والداجنة',
    'قطاع استصلاح الأراضي',
    'قطاع الشئون الاقتصادية',
    'قطاع الشئون المالية والتنمية الادارية',
    'الجهاز التنفيذي لمشروعات التنمية الشاملة'
  ]
};
class ProjectForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {};
    if (props.projectType === 'national') {
      schema.properties.reportFile.format = 'data-url';
      schema.properties.project_file.format = 'data-url';
    }

    this.state.schema = schema;
    this.state.formData = this.props.formData;
    if (this.state.formData && 'published' in this.state.formData) {
      this.state.isDraft = !this.state.formData.published;
    } else {
      this.state.isDraft = true;
    }
    // get sub_sectors according to project type
    this.state.subSectors = props.projectType === 'international' ? InternationalSubSectors['en_sub_sector'] : NationalSubSectors['en_sub_sector'];
    this.state.arabicsubSectors = props.projectType === 'international' ? InternationalSubSectors['ar_sub_sector'] : NationalSubSectors['ar_sub_sector'];
    // get type of fund according to project type
    this.state.typeFund = props.projectType === 'international' ? fundLabelsInter.en : fundLabelsNational.en;
    this.state.typeFundArabic = props.projectType === 'international' ? fundLabelsInter.ar : fundLabelsNational.ar;

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
        classNames: 'with-ar',
        'ui:field': 'textarea'
      },
      corrective_action_ar: {
        classNames: 'ar',
        'ui:field': 'textarea'
      },
      treat_corrective_action: {
        classNames: 'with-ar',
        'ui:field': 'textarea'
      },
      treat_corrective_action_ar: {
        classNames: 'ar',
        'ui:field': 'textarea'
      },
      published: {
        classNames: 'section-half',
        'ui:disabled': !this.props.auth.isAdmin(),
        'ui:widget': 'radio'
      },
      private: {
        classNames: 'section-half section-half-left',
        'ui:widget': 'radio'
      },
      project_delays: {
        classNames: 'with-ar',
        'ui:field': 'textarea'
      },
      project_delays_ar: {
        classNames: 'ar',
        'ui:field': 'textarea'
      },
      date_delay_occurrence: {
        classNames: 'form-extra-spacing',
        'ui:field': 'short-date'
      },
      date_corrective_action: {
        classNames: 'form-extra-spacing',
        'ui:field': 'short-date'
      },
      local_manager: {
        classNames: 'section-half'
      },
      local_manager_ar: {
        classNames: 'ar section-half section-half-left label-lower'
      },
      number_served: {
        classNames: 'form-block columns-small multiform-group',
        items: {
          number_served: {'ui:field': 'customnumber'},
          beneficiary_type: {'ui:field': 'select-beneficiary-type'}
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
      project_file: {
        'ui:placeholder': 'http://',
        'ui:widget': this.props.projectType === 'international' ? 'hidden' : 'file'
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
          donor: {'ui:field': 'select-donor'}
        }
      },
      disbursed: {
        classNames: 'form-block columns-small multiform-group',
        items: {
          fund: {'ui:field': 'currency'},
          date: {'ui:field': 'fund-date'},
          type: {'ui:field': 'select-disbursed-type'},
          donor: {'ui:field': 'select-donor'}
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
          component: {
            classNames: 'with-ar'
          },
          component_ar: {
            classNames: 'ar'
          }
        }
      },
      reportLink: {
        title: 'Report link',
        'ui:placeholder': 'http://'
      },
      reportFile: {
        title: 'Report file',
        'ui:placeholder': 'http://',
        'ui:widget': this.props.projectType === 'international' ? 'hidden' : 'file'
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
    const {schema, formData, isDraft, subSectors, arabicsubSectors, typeFund, typeFundArabic} = this.state;
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
          'Select a status - يُرجى اختيار وضع محدد',
          [
            'Planned',
            'Ongoing',
            'Closed'
          ],
          [
            'مُخطط',
            'جارى',
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
          'SDS Pillars - هدف استراتيجية التنمية المُستدامة',
          sdsLabels.select,
          sdsLabels.en,
          sdsLabels.ar,
          true
        ),
        'select-sdg_indicator': Dropdown(
          'SDGs - هدف التنمية المستدامة',
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
          'Type of Fund - نوع التمويل',
          'Select type of fund - يُرجى إختيار نوع التمويل',
          typeFund,
          typeFundArabic
        ),
        'select-kmi_status': Dropdown('Status', 'Select a status - يُرجى اختيار الوضع/ الحالة',
          ['Not Implemented', 'Partially Implemented', 'Implemented', 'N/A'],
          ['لم تنفذ', ' نفذت جزئياً', 'نفذت كليا', 'N/A']
        ),
        'select-donor': Dropdown(
          'Donor - الجهة المانحة',
          'Select a donor - يُرجى اختيار الجهة المانحة',
          donors.en,
          donors.ar,
          true
        ),
        'select-beneficiary-type': Dropdown(
          'Unit - الفئة',
          'Select a unit - يُرجى اختيار الفئة',
          beneficiaryTypes.en,
          beneficiaryTypes.ar,
          true
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
