import React from "react";
import cross from "./../img/cancel.svg";
import Printed_joVouch from './Printed_jovouch'

async function postData(url = "", data, m) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: m, // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      // 'Content-Type': 'multipart/form-data'
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "Content-Type": "application/json"
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

class AddJovouch extends React.Component {
  setData = () => {
    let d = this.props.EData;

    document.querySelector("#jovouch_bill_date").value = d.bill_date;
    document.querySelector("#jovouch_debit_acc").defaultValue = d.debit_acc;
    document.querySelector("#jovouch_credit_acc").defaultValue = d.credit_acc;
    let arr = [];
    d.payArr.map(e => {
      let a = JSON.parse(e);
      if (a.mode === " cheque") {
        a.mode = "cheque";
      }
      if (a.mode === " cash") {
        a.mode = "cash";
      }
      arr.push(a);
    });
    this.setState({ BillArr: d.billArr, payArr: arr });
    setTimeout(() => {
      this.updateBillAmt();
      this.updateAmt();
    }, 1000);
  };

  updateBillAmt = () => {
    let billAmt = 0;
    for (let aa of this.state.BillArr) {
      for (let a of this.state.data) {
        if (aa === a.det.bill_num) {
          billAmt = parseInt(billAmt) + parseInt(a.det.totalAmt);
        }
      }
    }
    this.setState({
      billAmt: billAmt
    });
  };

  updateAmt = () => {
    let amt = 0;
    for (let aa of this.state.payArr) {
      amt = parseInt(amt) + parseInt(aa.amt);
    }
    this.setState({
      amt: amt
    });
  };

  bill_list_change = i => {
    let arr = [];

    document.querySelector(".pro_list" + i).style.display = "block";
    const bill = document.querySelector(".jo_bill_no" + i).value;
    console.log(bill.length);

    if (i === 0) {
      const is = this.state.data.map(e => {
        if (bill.length == 0) {
          arr.push(e);
          return true;
        }
        if (e.det.bill_num.indexOf(bill) === -1) {
          return false;
        } else {
          arr.push(e);
          return true;
        }
      });

      this.setState({
        vouchData: arr
      });
    } else {
      const is = this.state.data.map(e => {
        if (
          e.det.bill_num.indexOf(bill) !== -1 &&
          e.det.customer === this.state.CBill.customer &&
          e.det.supplier === this.state.CBill.supplier
        ) {
          arr.push(e);
          return true;
        } else {
          return true;
        }
      });
      arr = arr.filter(e => {
        for (let a of this.state.BillArr) {
          if (a === e.det.bill_num) {
            return false;
          }
        }
        return true;
      });
      this.setState({
        vouchData: arr
      });
    }
  };
  addjovouch = async () => {
    let bill_date = document.querySelector("#jovouch_bill_date").value;
    let type = document.querySelector("#jovouch_type").value;
    let debit_acc = document.querySelector("#jovouch_debit_acc").value;
    let credit_acc = document.querySelector("#jovouch_credit_acc").value;
    let amount = document.querySelector("#jovouch_amount").value;
    let balance = document.querySelector("#jovouch_balance").value;

    let Vdata = {
      bill_date,
      type,
      debit_acc,
      credit_acc,
      amount,
      balance,
      billArr: this.state.BillArr,
      payArr: this.state.payArr
    };
    let m = this.props.mode === "edit" ? "PUT" : "POST";
    let url = this.props.mode === "edit" ? "/api/jovouch/" + this.props.EData.id : "/api/jovouch";
    let t = await postData(url, Vdata, m);

    if (t) {
      this.props.rm();
    } else {
      alert("Internal Error , Please Try Again Later");
    }
  };

  updateVouchData = () => {
    fetch("/api/vouch")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        let f = data;

        f = f.filter(e => {
          if (e.det.status == 0) {
            return false;
          } else {
            return true;
          }
        });
        this.setState(() => {
          return {
            data: f
          };
        });
        this.updateBillAmt();
      });
  };

  constructor(props) {
    super(props);
    this.updateVouchData();
    this.state = {
      products: [],
      amt: 0,
      accounts: [],
      items: [],
      vouchData: [],
      data: [],
      editItem: 0,

      CBill: [],
      BillArr: [""],
      billAmt: 0,
      payArr: [
        {
          mode: "cheque",
          det: "",
          amt: ""
        }
      ]
    };
  }

  componentDidMount() {
    let field = document.getElementById("jovouch_bill_date");
    let date = new Date();
    field.value =
      date.getFullYear().toString() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, 0) +
      "-" +
      date.getDate().toString().padStart(2, 0);
    if (this.props.mode === "edit") {
      this.setData();
    }
  }

  render() {
    return (
      <div className="add_jovouch_con">
        <div className="add_pro_head">
          <h1>Add Journal jovoucher</h1>

          <div className="add_jovouch_right_btns">
          {this.props.mode === 'edit' && (<p 
            onClick = {() => {
              window.print()
            }}>Print</p>)}
            <p onClick={this.addjovouch}>Save</p>
            <p
              onClick={() => {
                this.setState({
                  BillArr: [""],
                  payArr: [],
                  Cbill: [],
                  amt: 0,
                  billAmt: 0
                });
              }}
            >
              Reset
            </p>
            <img onClick={this.props.rm} src={cross} alt="" />
          </div>
        </div>
          <Printed_joVouch 
              jobill_num =  {this.props.jobill_num}
          />

        <div className="jovouch_body">
          <form action="/api/jovouch" id="jovouch_det" method="post">
            <div className="jovouch_details">
              <div className="jovouch_si">
                <span> Date</span>
                <br />
                <input type="date" name="jovouch_bill_date" id="jovouch_bill_date" />
              </div>
              <div className="jovouch_si">
                <span>Type</span>
                <br />
                <select name="jovouch_type" id="jovouch_type">
                  <option value="option1">Journal</option>
                  <option value="option1">Journal</option>
                  <option value="option1">Journal</option>
                </select>
              </div>
            </div>

            <div className="jovouch_customer">
              <div className="jovouch_si ">
                <span>Add Bill </span>

                <div className="second_row">
                  {this.state.BillArr.map((e, i) => {
                    return (
                      <span className="jovouch_bill_list">
                        <span
                          id="bill_cross_btn"
                          onClick={() => {
                            let arr = this.state.BillArr;
                            arr.splice(i, 1);
                            this.setState({ BillArr: arr });
                            this.updateBillAmt();
                            this.state.BillArr.map((a, ii) => {
                              document.querySelector(".jo_bill_no" + ii).value = a;
                            });
                          }}
                        >
                          +
                        </span>
                        {this.state.data.length !== 0 && (
                          <input
                            type="text"
                            placeholder="Bill No."
                            onBlur={() => {
                              setTimeout(() => {
                                if (document.querySelector(".pro_list" + i)) {
                                  document.querySelector(".pro_list" + i).style.display = "none";
                                  let arr = this.state.BillArr;
                                  arr[i] = document.querySelector(".jo_bill_no" + i).value;
                                  if (arr[i].length === 0) {
                                    return;
                                  }
                                  this.setState({ BillArr: arr });
                                  this.updateBillAmt();
                                }
                              }, 500);
                            }}
                            onChange={() => {
                              this.bill_list_change(i);
                            }}
                            onFocus={() => {
                              this.bill_list_change(i);
                            }}
                            id="jovouch_bill_no"
                            className={"jo_bill_no" + i}
                            autoComplete="off"
                            defaultValue={e}
                          />
                        )}
                        <ul id="pro_list" className={"pro_list" + i} style={{ display: "none" }}>
                          {this.state.vouchData.map((pro, index) => {
                            console.log(pro);
                            return (
                              <li
                                key={index}
                                onClick={() => {
                                  document.querySelector(".jo_bill_no" + i).value = pro.det.bill_num;
                                  document.querySelector(".pro_list" + i).style.display = "none";
                                  if (i === 0) {
                                    this.setState({ CBill: pro.det });
                                    document.getElementById("jovouch_debit_acc").value = pro.det.customer;
                                    document.getElementById("jovouch_credit_acc").value = pro.det.supplier;
                                  } else {
                                  }
                                }}
                              >
                                {pro.det.bill_num}
                              </li>
                            );
                          })}
                        </ul>
                      </span>
                    );
                  })}
                  <span>
                    <span
                      onClick={() => {
                        let arr = this.state.BillArr;
                        arr.push("");

                        this.setState({ BillArr: arr });
                      }}
                      className="jovouch_plus"
                    >
                      +
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="vouch_body">
              <div className="jovouch_debit">
                <span>Debit Account</span>
                <br />
                <input name="jovouch_debit_acc" id="jovouch_debit_acc" />
              </div>

              <div className="jovouch_debit">
                <span>Credit Account</span>
                <br />
                <input name="jovouch_credit_acc" id="jovouch_credit_acc" />
              </div>
            </div>
          </form>
        </div>
        <div className="pay_head">Payment Details</div>
        <div className="jovouch_payment_det ">
          {this.state.payArr.map((e, index) => {
            return (
              <div className="jovouch_customer ">
                <div className="jovouch_si ">
                  <div className="mode_head">
                    <span>Mode </span>
                  </div>

                  <span>
                    <select
                      onChange={() => {
                        let a = this.state.payArr;
                        a[index].mode = document.getElementById("jovouch_mode" + index).value;
                        this.setState({ payArr: a });
                      }}
                      name="jovouch_mode"
                      id={"jovouch_mode" + index}
                    >
                      <option selected={e.mode === "cheque" ? true : false} value="cheque">
                        Cheque
                      </option>
                      <option selected={e.mode === "cash" ? true : false} value="cash">
                        Cash
                      </option>
                    </select>
                  </span>
                </div>

                {this.state.payArr[index].mode === "cheque" ? (
                  <div className="jovouch_si  ">
                    <span>Cheque No. </span>
                    <br />
                    <div className="second_row">
                      <input
                        type="text"
                        placeholder="Cheque No."
                        defaultValue={e.det}
                        className="paydet"
                        id={"payDet" + index}
                      />
                    </div>
                  </div>
                ) : null}
                <div className="jovouch_si jovoamt ">
                  <span>Amount </span>
                  <br />
                  {this.state.payArr.length - 1 === index ? null : (
                    <span
                      id="amt_cross_btn"
                      onClick={() => {
                        let arr = this.state.payArr;
                        arr.splice(index, 1);
                        this.setState({ payArr: arr });
                        this.updateAmt();
                      }}
                    >
                      +
                    </span>
                  )}
                  <div className="second_row">
                    <input
                      onBlur={() => {
                        let nn;
                        if (document.getElementById("payDet" + index)) {
                          nn = {
                            mode: document.getElementById(`jovouch_mode${index}`).value,
                            det: document.getElementById(`payDet${index}`).value,

                            amt: document.getElementById(`payAmt${index}`).value
                          };
                        } else {
                          nn = {
                            mode: document.getElementById(`jovouch_mode${index}`).value,

                            amt: document.getElementById(`payAmt${index}`).value
                          };
                        }
                        let arr = this.state.payArr;
                        arr[index].dd = nn.mode;
                        arr[index].det = nn.det;
                        {
                          nn.amt ? (arr[index].amt = nn.amt) : (arr[index].amt = 0);
                        }
                        this.setState({
                          payArr: arr
                        });
                        this.updateAmt();
                      }}
                      type="text"
                      placeholder="Amount"
                      id={"payAmt" + index}
                      className="amount"
                      defaultValue={e.amt}
                    />
                    {index === this.state.payArr.length - 1 && (
                      <span
                        className="jovouch_plus"
                        onClick={() => {
                          let arr = this.state.payArr;
                          arr.push({ mode: "cheque", det: "", amt: 0 });
                          this.setState({
                            payArr: arr
                          });
                        }}
                      >
                        +
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <br />
          <br />
          <div className="jovouch_amount">
            <span>Amount:</span>
            <span>
              <input type="text" id="jovouch_amount" value={this.state.billAmt} placeholder="Amount" />
            </span>
            <span className="jovouch_balance">Balance:</span>
            <span>
              <input
                id="jovouch_balance"
                value={this.state.billAmt - this.state.amt}
                type="text"
                placeholder="Balance"
                style={{ color: this.state.billAmt - this.state.amt > 0 ? "red" : "green" }}
              />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default AddJovouch;
