import React, {Component} from 'react';
import axios from 'axios';

export default class RemoveItem extends Component {
    constructor(props) {
        super(props);

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

    onSubmit(e) {
        e.preventDefault();
        
        console.log('Deleted');

        

        axios.delete('http://localhost:4000/items/remove/'+this.props.match.params.id)
            .then(res => console.log('Deleted Item'));

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
                                    />
                        </div>
                        <div className="form-group">
                            <label>Type:</label>
                            <input  type="text" 
                                    className="form-control" 
                                    value={this.state.item_type} 
                                    />
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
                                        />
                                <label className="form-check-label">New</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input  className="form-check-input"
                                        type="radio"
                                        name="conditionOptions"
                                        id="conditionUsed"
                                        value="Used"
                                        checked={this.state.item_condition==='Used'}
                                        />
                                <label className="form-check-label">Used</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input  className="form-check-input"
                                        type="radio"
                                        name="conditionOptions"
                                        id="conditionNeedsRepairs"
                                        value="Needs Repairs"
                                        checked={this.state.item_condition==='Needs Repairs'}
                                        />
                                <label className="form-check-label">Needs Repairs</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Name:</label>
                            <input  type="text" 
                                    className="form-control" 
                                    value={this.state.item_name} 
                                    />
                        </div>
                        <div className="form-group">
                            <label>Amount:</label>
                            <input  type="number" 
                                    className="form-control" 
                                    value={this.state.item_amount} 
                                    />
                        </div>
                        <div className="form-group">
                            <label>warranty:</label>
                            <input  type="text" 
                                    className="form-control" 
                                    value={this.state.item_warranty} 
                                    />
                        </div>
                        <div className="form-group">
                            <label>Purchase Date:</label>
                            <input  type="text" 
                                    className="form-control" 
                                    value={this.state.item_purchaseDate} 
                                    />
                        </div>
                        <br/>
                        <div className="form-group">
                            <input type="submit" value="Delete Item" className="btn btn-primary"/>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
//export default remove-item;