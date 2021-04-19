import React, {Component} from 'react';
import axios from 'axios';
//import {withRouter} from 'react-router-dom';


export default class EditItem extends Component {

    constructor(props) {
        super(props);

        this.onChangeItemId = this.onChangeItemId.bind(this);
        this.onChangeItemType = this.onChangeItemType.bind(this);
        this.onChangeItemCondition = this.onChangeItemCondition.bind(this);
        this.onChangeItemName = this.onChangeItemName.bind(this);
        this.onChangeItemAmount = this.onChangeItemAmount.bind(this);
        this.onChangeItemWarranty =this.onChangeItemWarranty.bind(this);
        this.onChangeItemPurchaseDate = this.onChangeItemPurchaseDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            item_id: '',
            item_type: '',
            item_condition: '',
            item_name: '',
            item_amount: 0,
            item_warranty: '',
            item_purchaseDate: ''
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/items/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    item_id: response.data.item_id,
                    item_type: response.data.item_type,
                    item_condition: response.data.item_condition,
                    item_name: response.data.item_name,
                    item_amount: response.data.item_amount,
                    item_warranty: response.data.item_warranty,
                    item_purchaseDate: response.data.item_purchaseDate
                })
            })
            .catch(function(error){
                console.log(error);
            })
    }

    onChangeItemId(e) {
        this.setState({
            item_id: e.target.value
        });
    }
    
    onChangeItemType(e) {
        this.setState({
            item_type: e.target.value
        });
    }

    onChangeItemCondition(e) {
        this.setState({
            item_condition: e.target.value
        });
    }

    onChangeItemName(e) {
        this.setState({
            item_name: e.target.value
        });
    }

    onChangeItemAmount(e) {
        this.setState({
            item_amount: e.target.value
        });
    }

    onChangeItemWarranty(e) {
        this.setState({
            item_warranty: e.target.value
        });
    }

    onChangeItemPurchaseDate(e) {
        this.setState({
            item_purchaseDate: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        
        console.log('Updated');

        const obj = {
            item_id: this.state.item_id,
            item_type: this.state.item_type,
            item_condition: this.state.item_condition,
            item_name: this.state.item_name,
            item_amount: this.state.item_amount,
            item_warranty: this.state.item_warranty,
            item_purchaseDate: this.state.item_purchaseDate
        };

        axios.put('http://localhost:4000/items/update/'+this.props.match.params.id, obj)
            .then(res => console.log(res.data));
        
        this.props.history.push('/');
    }

    render() {
        return(
            <div>
                <h3>Edit Item</h3>
                <form onSubmit={this.onSubmit}>
                    <div>
                        <div className="form-group">
                            <label>ID:</label>
                            <input  type="text" 
                                    className="form-control" 
                                    value={this.state.item_id} 
                                    onChange={this.onChangeItemId}/>
                        </div>
                        <div className="form-group">
                            <label>Type:</label>
                            <input  type="text" 
                                    className="form-control" 
                                    value={this.state.item_type} 
                                    onChange={this.onChangeItemType}/>
                        </div>
                        <div className="form-group">
                            <label>Condition:</label>
                            <div className="form-check form-check-inline">
                                <input  className="form-check-input"
                                        type="radio"
                                        name="conditionOptions"
                                        id="conditionNew"
                                        value="New"
                                        checked={this.state.item_condition==='New'}
                                        onChange={this.onChangeItemCondition}/>
                                <label className="form-check-label">New</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input  className="form-check-input"
                                        type="radio"
                                        name="conditionOptions"
                                        id="conditionUsed"
                                        value="Used"
                                        checked={this.state.item_condition==='Used'}
                                        onChange={this.onChangeItemCondition}/>
                                <label className="form-check-label">Used</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input  className="form-check-input"
                                        type="radio"
                                        name="conditionOptions"
                                        id="conditionNeedsRepairs"
                                        value="Needs Repairs"
                                        checked={this.state.item_condition==='Needs Repairs'}
                                        onChange={this.onChangeItemCondition}/>
                                <label className="form-check-label">Needs Repairs</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Name:</label>
                            <input  type="text" 
                                    className="form-control" 
                                    value={this.state.item_name} 
                                    onChange={this.onChangeItemName}/>
                        </div>
                        <div className="form-group">
                            <label>Amount:</label>
                            <input  type="number" 
                                    className="form-control" 
                                    value={this.state.item_amount} 
                                    onChange={this.onChangeItemAmount}/>
                        </div>
                        <div className="form-group">
                            <label>warranty:</label>
                            <input  type="text" 
                                    className="form-control" 
                                    value={this.state.item_warranty} 
                                    onChange={this.onChangeItemWarranty}/>
                        </div>
                        <div className="form-group">
                            <label>Purchase Date:</label>
                            <input  type="text" 
                                    className="form-control" 
                                    value={this.state.item_purchaseDate} 
                                    onChange={this.onChangeItemPurchaseDate}/>
                        </div>
                        <br/>
                        <div className="form-group">
                            <input type="submit" value="Save Changes" className="btn btn-primary"/>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
//export default withRouter(EditItem);