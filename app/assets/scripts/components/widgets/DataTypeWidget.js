import React from 'react';

export default class DataTypeWidget extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      category: props.formData
    };
  }

  onChange (event) {
    let nextValue = (event.target.value === '-1') ? undefined : event.target.value;
    return this.setState({
      category: nextValue
    }, () => this.props.onChange(this.state.category));
  }

  render () {
    return (
      <div>
        <label className="control-label">{this.props.schema.title}</label>
        <select value={this.state.category} className="form-control" onChange={this.onChange.bind(this)}>
          <option value="-1">Select the type of data</option>
          <option value="Sequential">Sequential - متتابع</option>
          <option value="Diverging">Diverging - متشعب</option>
          <option value="Categorical">Categorical - تصنيفي</option>
        </select>
        <div className="field-example">
          <h3 className="header-small">Type of Data Examples</h3>
          <div className="field-example-item">
            <h4 className="header-smallest">Sequential - متتابع</h4>
            <p>Data is an increasing or decreasing range <br/>(e.g. 0,1,2,3,4,5 ...)</p>
            <p className="ar">البيانات التي يتزايد نطاقها أو يتناقص (مثال: 0,1,2,3,4,5 ...)</p>
          </div>
          <div className="field-example-item">
            <h4 className="header-smallest">Diverging - متشعب</h4>
            <p>Data highlights two opposing extremes <br/>(e.g. -1 &larr; 0 &rarr; 1)</p>
            <p className="ar">البيانات التي تسلط الضوء على حدين متعارضين<br/> (مثال: -1 &rarr; 0 &larr; 1)</p>
          </div>
          <div className="field-example-item">
            <h4 className="header-smallest">Categorical - تصنيفي</h4>
            <p>Data represents different categories</p>
            <p className="ar">تمثل البيانات فئات مختلفة (مثال: عالي جدا، عالي، متوسط، منخفض، منخفض جدا)</p>
          </div>
        </div>
      </div>
    );
  }
}
