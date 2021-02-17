import React from 'react';

export default class CurrencyField extends React.Component {
  constructor (props) {
    super(props);

    this.state = {};
    for (let key in props.formData) {
      this.state[key] = props.formData[key];
    }
  }

  setMaybe (nextState) {
    let maybeState = {};
    for (let key in nextState) {
      let val = nextState[key];
      if (
        (typeof val === 'number' && isNaN(val)) ||
        (typeof val === 'string' && val.length === 0) ||
        val === null ||
        typeof val === undefined
      ) {
        maybeState[key] = undefined;
      } else {
        maybeState[key] = val;
      }
    }

    this.setState(maybeState, () => this.props.onChange(this.state));
  }

  onChange (name) {
    return (event) => {
      let scratch = Object.assign({}, this.state);
      scratch[name] = parseFloat(event.target.value);
      scratch['amount'] = scratch['rate'] * scratch['original'];

      this.setMaybe(Object.assign({}, this.state, {
        amount: scratch['amount'],
        rate: scratch['rate'],
        original: scratch['original']
      }));
    };
  }

  onChangeCurrency (event) {
    let nextValue = (event.target.value === '-1') ? undefined : event.target.value;
    this.setMaybe(Object.assign({}, this.state, {currency: nextValue}));
  }

  render () {
    const {currency, original, rate, amount} = this.state;
    return <div>
      <legend>{this.props.schema.title}</legend>
      <div className="row">
        <div className="col-sm-4">
          <label>Currency - العملة * </label>
          <select className="select-sm" name="currency_code" value={currency} onChange={this.onChangeCurrency.bind(this)}>
            <option value='-1'>Select a currency - يُرجى اختيار عملة التداول</option>
            <option value="AUD">Australian Dollar</option>
            <option value="BRL">Brazilian Real</option>
            <option value="CAD">Canadian Dollar</option>
            <option value="CZK">Czech Koruna</option>
            <option value="DKK">Danish Krone</option>
            <option value="EGP">Egyptian Pound</option>
            <option value="EUR">Euro</option>
            <option value="HKD">Hong Kong Dollar</option>
            <option value="HUF">Hungarian Forint </option>
            <option value="JPY">Japanese Yen</option>
            <option value="MYR">Malaysian Ringgit</option>
            <option value="MXN">Mexican Peso</option>
            <option value="NOK">Norwegian Krone</option>
            <option value="NZD">New Zealand Dollar</option>
            <option value="PHP">Philippine Peso</option>
            <option value="PLN">Polish Zloty</option>
            <option value="GBP">Pound Sterling</option>
            <option value="SGD">Singapore Dollar</option>
            <option value="SEK">Swedish Krona</option>
            <option value="CHF">Swiss Franc</option>
            <option value="TWD">Taiwan New Dollar</option>
            <option value="THB">Thai Baht</option>
            <option value="TRY">Turkish Lira</option>
            <option value="USD">U.S. Dollar</option>
          </select>
        </div>
        <div className="col-sm-4">
          <label>Original Amount - المبلغ الأصلي * </label>
          <input className="form-control" type="number" value={original} step="1"
            onChange={this.onChange('original')} />
        </div>
        <div className="col-sm-4">
          <label>Exchange Rate At Time Of Agreement Signature - سعر الصرف وقت توقيع الاتفاقية* </label>
          <input className="form-control" type="number" value={rate} step="0.01"
            onChange={this.onChange('rate')} />
        </div>
      </div>
      <div className="row" >
        <div className="col-sm-4">
          <label>Amount - المبلغ</label>
          <input className="form-control" type="number" value={amount} disabled/>
        </div>
      </div>
    </div>;
  }
}
