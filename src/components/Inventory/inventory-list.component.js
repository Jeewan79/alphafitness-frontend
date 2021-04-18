import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Item = props => (
    <tr>
        <td className={props.item.item_completed ? 'completed' : ''}>{props.item.item_id}</td>
        <td className={props.item.item_completed ? 'completed' : ''}>{props.item.item_type}</td>
        <td className={props.item.item_completed ? 'completed' : ''}>{props.item.item_condition}</td>
        <td className={props.item.item_completed ? 'completed' : ''}>{props.item.item_name}</td>
        <td className={props.item.item_completed ? 'completed' : ''}>{props.item.item_amount}</td>
        <td className={props.item.item_completed ? 'completed' : ''}>{props.item.item_warranty}</td>
        <td className={props.item.item_completed ? 'completed' : ''}>{props.item.item_purchaseDate}</td>
        <td>
            <Link to={"/edit/"+props.item._id}>Edit</Link>
            <Link to={"/remove/"+props.item._id}>Delete</Link>
        </td>
    </tr>
)

export default class ItemList extends Component {

    constructor(props) {
        super(props);
        this.state = {items: []};
    }

    componentDidMount() {
        axios.get('http://localhost:4000/items/')
        .then(response => {
            this.setState({items: response.data});
        })
        .catch(function (err) {
            console.log(error);
        })
    }

    itemList() {
        return this.state.items.map(function(currentItem, i) {
            return <Item item={currentItem} key={i} />
        })
    }

    render() {
        return(
            <div>
                <h3>View Inventory</h3>
                <table className="table table-striped" style={{marginTop: 20}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Condition</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Warranty</th>
                            <th>Purchase Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.itemList() }
                    </tbody>
                </table>
            </div>
        )
    }
}