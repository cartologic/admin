import React from 'react';
import { governorateMap, arabicGovernorateMap, reverseGovernorateMap } from '../../utils/locationNames';
import _ from 'lodash';
import districtNames from '../../utils/districtNames';

import {
  getDefaultFormState,
  retrieveSchema,
  toIdSchema
} from 'react-jsonschema-form/lib/utils';

class LocationFieldItem extends React.Component {
  constructor (props) {
    super(props);
    this.state = _.cloneDeep(props.formData);
    this.onChange = this.onChange.bind(this);
  }

  onChange (name) {
    return (event) => {
      let value = event.target.value;
      let newState = _.cloneDeep(this.state);

      if (name === 'governorate' || name === 'district') {
        newState['district'][name] = value;
      } else if (name === 'lat' || name === 'lon') {
        value = parseFloat(value);

        if (isNaN(value)) {
          value = undefined;
        }

        newState['marker'][name] = value;
      } else if (name === 'village') {
        newState['marker'][name] = value;
      }

      this.setState(newState, () => this.props.onChange(this.state));
    };
  }

  render () {
    const {lat, lon, village} = this.state.marker;
    const {district, governorate} = this.state.district;
    const chosenGovernorate = reverseGovernorateMap[governorate] || '';

    let districts = (chosenGovernorate === '' ? [] : districtNames[chosenGovernorate].map((district) => {
      return <option key={district['district_marker']} value={district['district_marker']}>{district['district'] + ' - ' + district['district_ar']}</option>;
    }));
    if (districts.length) districts.unshift(<option key={'-2'} value={'All'}>All Districts - كل المراكز </option>);
    districts.unshift(<option key={'-1'} value={''}>District</option>);

    const governorates = Object.keys(governorateMap).map((governorate) => {
      return <option key={governorateMap[governorate]} value={governorateMap[governorate]}>{governorate + ' - ' + arabicGovernorateMap[governorate]}</option>;
    });

    governorates.unshift(<option key={'-1'} value={''}>Governorate</option>);
    return (
      <div className='form-group'>
        <div className="form-location">
          <legend>{this.props.schema.title}</legend>
          <div className="row">
            <div className="col-sm-6">
              <label>Governorate - المحافظة *</label>
              <select className="form-control" value={governorate} onChange={this.onChange('governorate')}>
                {governorates}
              </select>
            </div>
            <div className="col-sm-6">
              <label>District/Municipality - المركز/قسم</label>
              <select className="form-control" value={district} onChange={this.onChange('district')}>
                {districts}
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label>Latitude - خط العرض</label>
            <input className="form-control" type="number" value={lat} step="0.00001"
              onChange={this.onChange('lat')} />
          </div>
          <div className="col-sm-6">
            <label>Longitude - خط الطول</label>
            <input className="form-control" type="number" value={lon} step="0.00001"
              onChange={this.onChange('lon')} />
          </div>
          <div className="col-sm-6">
            <label>Village</label>
            <input className="form-control" type="text" value={village}
              onChange={this.onChange('village')} />
          </div>
        </div>
      </div>
    );
  }
}

function ArrayFieldTitle ({ TitleField, idSchema, title, required }) {
  if (!title) {
    return <div />;
  }
  const id = `${idSchema.$id}__title`;
  return <TitleField id={id} title={title} required={required} />;
}

function ArrayFieldDescription ({ DescriptionField, idSchema, description }) {
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  const id = `${idSchema.$id}__description`;
  return <DescriptionField id={id} description={description} />;
}

function IconBtn (props) {
  const { type = 'default', icon, className, style, tabIndex, onClick, disabled } = props;
  return (
    <button
      type="button"
      className={`btn btn-${type} ${className}`}
      tabIndex={tabIndex}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      <i className={`glyphicon glyphicon-${icon}`} />
    </button>
  );
}

function AddButton ({ onClick, disabled }) {
  return (
    <div className="row">
      <p className="col-xs-3 col-xs-offset-9 array-item-add text-right">
        <IconBtn
          type="info"
          icon="plus"
          className="btn-add col-xs-12"
          tabIndex="0"
          onClick={onClick}
          disabled={disabled}
        />
      </p>
    </div>
  );
}

export default class LocationFieldArray extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.state.formData = props.formData || [];
    this.onChange = this.onChange.bind(this);
    this.isItemRequired = this.isItemRequired.bind(this);
    this.onAddClick = this.onAddClick.bind(this);
    this.onDropIndexClick = this.onDropIndexClick.bind(this);
    this.onDuplicateIndexClick = this.onDuplicateIndexClick.bind(this);
    this.onChangeForIndex = this.onChangeForIndex.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  onChange (formData, {validate}) {
    this.setState({formData}, () => this.props.onChange(this.state.formData, {validate}));
  }

  get itemTitle () {
    const { schema } = this.props;
    return schema.items.title || schema.items.description || 'Item';
  }

  isItemRequired (itemSchema) {
    if (Array.isArray(itemSchema.type)) {
      // While we don't yet support composite/nullable jsonschema types, it's
      // future-proof to check for requirement against these.
      return !itemSchema.type.includes('null');
    }
    // All non-null array item types are inherently required by design
    return itemSchema.type !== 'null';
  }

  onAddClick (event) {
    event.preventDefault();
    const { schema, registry } = this.props;
    const { definitions } = registry;
    let itemSchema = schema.items;
    const formData = this.state.formData;
    this.onChange(
      [...formData, Object.assign({}, getDefaultFormState(itemSchema, undefined, definitions), {key: `key-${Math.random()}`})],
      { validate: false }
    );
  }

  onDropIndexClick (index) {
    return event => {
      if (event) {
        event.preventDefault();
      }
      const formData = this.state.formData;
      // refs #195: revalidate to ensure properly reindexing errors
      this.onChange(formData.filter((_, i) => i !== index), { validate: true });
    };
  }

  onDuplicateIndexClick (index) {
    return event => {
      if (event) {
        event.preventDefault();
      }
      const formData = this.state.formData;
      let newItem = _.cloneDeep(formData[index]);
      newItem.key = `key-${Math.random()}`;
      let newFormData = [...formData.slice(0, index + 1), newItem, ...formData.slice(index + 1)];
      this.onChange(newFormData, { validate: false });
    };
  }

  onChangeForIndex (index) {
    return value => {
      const formData = this.state.formData;
      const newFormData = formData.map((item, i) => {
        // We need to treat undefined items as nulls to have validation.
        // See https://github.com/tdegrunt/jsonschema/issues/206
        const jsonValue = typeof value === 'undefined' ? null : value;
        return index === i ? jsonValue : item;
      });
      this.onChange(newFormData, { validate: false });
    };
  }

  onSelectChange (value) {
    this.onChange(value, { validate: false });
  }

  render () {
    const {
      schema,
      uiSchema,
      errorSchema,
      idSchema,
      name,
      required,
      registry,
      onBlur
    } = this.props;
    const title = schema.title === undefined ? name : schema.title;
    const { definitions, fields } = registry;
    const { TitleField, DescriptionField } = fields;
    const itemSchema = retrieveSchema(schema.items, definitions);

    const component = this;
    const btnStyle = {
      flex: 1,
      paddingLeft: 6,
      paddingRight: 6,
      fontWeight: 'bold'
    };

    let items = this.state.formData.map((item, index) => {
      const itemErrorSchema = errorSchema ? errorSchema[index] : undefined;
      const itemIdPrefix = idSchema.$id + '_' + index;
      const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, definitions);
      return (<div key={index} className={'array-item'}>

        <div className={'col-xs-9'}>
          <LocationFieldItem
            key={index}
            schema={itemSchema}
            uiSchema={uiSchema.items}
            formData={item}
            errorSchema={itemErrorSchema}
            idSchema={itemIdSchema}
            required={this.isItemRequired(itemSchema)}
            onChange={this.onChangeForIndex(index)}
            onBlur={onBlur}
            registry={this.props.registry}
          />
        </div>

        <div className='col-xs-3 array-item-toolbox'>
          <div
            className='btn-group--separate'
            style={{ display: 'flex', justifyContent: 'flex-start' }}>

            <IconBtn
              icon='duplicate'
              className='array-item-duplicate'
              tabIndex='-1'
              style={btnStyle}
              onClick={component.onDuplicateIndexClick(index)}
            />

          <IconBtn
            type='danger'
            icon='remove'
            className='array-item-remove'
            tabIndex='-1'
            style={btnStyle}
            onClick={component.onDropIndexClick(index)}
          />
        </div>
      </div>

    </div>);
    });

    return (
      <fieldset className={`field field-array field-array-of-${itemSchema.type}`}>

        <ArrayFieldTitle
          key={`array-field-title-${idSchema.$id}`}
          TitleField={TitleField}
          idSchema={idSchema}
          title={title}
          required={required}
        />

      {schema.description &&
          <ArrayFieldDescription
            key={`array-field-description-${idSchema.$id}`}
            DescriptionField={DescriptionField}
            idSchema={idSchema}
            description={schema.description}
          />}

        <div
          className="row array-item-list"
          key={`array-item-list-${idSchema.$id}`}>
          {items}
        </div>

        <AddButton
          onClick={component.onAddClick}
        />
      </fieldset>
    );
  }
}
