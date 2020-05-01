import React from 'react'
import ref from './../img/refresh.svg'


class NavSec extends React.Component {

    

    constructor(props){
        super(props)
       

    }

    render() {


        return (

            <div className="nav_sec">

                <div className="nav_items">
                    {this.props.navItems && this.props.navItems.map((item) => {
                        return (<li 
                        className={this.props.ProOrAcc === item ? "black": "grey"}
                        onClick={() =>{this.props.setProOrAcc(item)}}>{item}
                        </li>)
                    })}
                </div>

                <div className="other_det">

                <div className="add_account"
                    onClick={this.props.ProOrAcc ==="Products" ? 
                    this.props.AddProCrossBtn :
                    this.props.AddAccCrossBtn
                    
                    }>

                        + Add {this.props.ProOrAcc === "Products" ? "Product" :"Account"}

                    </div>

                    <img src={ref} onClick={this.props.ProOrAcc ==="Products" ? 
                    this.props.getProducts :
                    this.props.getAccounts} />

                    <input type="text" id="searchForProOrAcc" 
                    onChange={()=>{this.props.fi()}} />
                </div>



            </div>
        )
    }
}

export default NavSec
