import React from "react";
import Delete from "components/Delete";
import ref from "assets/icons/refresh.svg";
import trash from "assets/icons/trash.svg";
import pencil from "assets/icons/pencil.svg";
import Printed_Invoice from './Printed_invoice'


class VouchCon1 extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      addVouch: false,
      addDebit: false,
      data: [],
      tempdata: [],
      Debitdata: [],
      JoVouchdata: [],
      tempJodata: [],
      Creditdata: [],
      deleteUrl: null,
      delete: false,
      err_vouch: false,
      err_jovouch: false,
      err_debit: false,
      err_credit: false
    };

  }
  updateVouchData = url => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState(() => {
          return {
            data: data,
            tempdata: data
          };
        });
      })
      .catch(err => {
        this.setState(() => {
          return {
            err_vouch: true
          };
        });
      });
  };

  updateJoVouchData = url => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState(() => {
          return {
            JoVouchdata: data,
            tempJodata: data
          };
        });
      })
      .catch(err => {
        this.setState(() => {
          return {
            err_jovouch: true
          };
        });
      });
  };

  componentDidMount(){
    this.updateVouchData("/api/vouch?mode=newest");

    this.updateJoVouchData("/api/jovouch?mode=newest");
  }
  render() {
    return (
      <div className="pro_compo">
        <div className = "print_inv">
          <Printed_Invoice />
        </div>
        <div className="nav_sec_trans nav_sec_vouch">
          {this.state.delete && <Delete deleteHide={this.deleteHide} deleteUrl={this.state.deleteUrl} />}
          <div className="nav_items">
            <li
              className={this.props.vouchPage === "pv" ? "black" : "grey"}
              onClick={() => {
                this.props.setVouchPage("pv");
              }}
            >
              Sales Vouchers
            </li>
            <li
              className={this.props.vouchPage === "jv" ? "black" : "grey"}
              onClick={() => {
                this.props.setVouchPage("jv");
              }}
            >
              Journal Vouchers
            </li>
            <li
              className={this.props.vouchPage === "dn" ? "black" : "grey"}
              onClick={() => {
                this.props.setVouchPage("dn");
              }}
            >
              Debit Note
            </li>
            <li
              className={this.props.vouchPage === "cn" ? "black" : "grey"}
              onClick={() => {
                this.props.setVouchPage("cn");
              }}
            >
              Credit Note
            </li>
          </div>
          <div className="other_det">
            <div
              className="add_vouch"
              onClick={() => {
                this.props.setPVoJVoDN(this.props.vouchPage, "add");
              }}
            >
              + Add {this.props.vouchPage === "jv" && "Journal Vouchers"}
              {this.props.vouchPage === "pv" && "Sales Vouchers"}
              {this.props.vouchPage === "dn" && "Debit Note"}
              {this.props.vouchPage === "cn" && "Credit Note"}
            </div>

            <img
              src={ref}
              alt=" "
              onClick={this.props.ProOrAcc === "Products" ? this.props.getProducts : this.props.getAccounts}
            />
          </div>
        </div>

        <div className="filter_vouch">
          <h2 className="filter_acc_h">Show Only</h2>
          <hr />
          <div className="search_line">
            <input
              type="search"
              id="searc_vouchers"
              placeholder="Search"
              onChange={() => {import React from "react";
              import Delete from "components/Delete";
              import ref from "assets/icons/refresh.svg";
              import trash from "assets/icons/trash.svg";
              import pencil from "assets/icons/pencil.svg";
              import Printed_Invoice from './Printed_invoice'
              
              
              class VouchCon1 extends React.Component {
                deleteIt = url => {
                  this.setState({ delete: true, deleteUrl: url });
                };
                deleteHide = () => {
                  this.updateVouchData("/api/vouch?mode=newest");
                  this.updateJoVouchData("/api/jovouch?mode=newest");
                  this.setState({ delete: false });
                };
              
                ModeHandler = async () => {
                  let newest = await document.getElementById("newest");
                  let oldest = await document.getElementById("oldest");
                  let high = await document.getElementById("high");
                  let low = await document.getElementById("low");
                  let paid = await document.getElementById("paid");
                  let unpaid = await document.getElementById("unpaid");
              
                  if (this.props.vouchPage === "jv") {
                    if (oldest.checked) {
                      this.updateJoVouchData("/api/jovouch?mode=oldest");
                    } else if (newest.checked) {
                      this.updateJoVouchData("/api/jovouch?mode=newest");
                    } else if (low.checked) {
                      this.updateJoVouchData("/api/jovouch?dir=low");
                    } else if (high.checked) {
                      this.updateJoVouchData("/api/jovouch?dir=high");
                    } else if (paid.checked) {
                      let fPro = this.state.tempJodata.filter(data => {
                        if (data === "") {
                          return true;
                        } else if (parseInt(data.balance) <= 0) {
                          return true;
                        }
                      });
              
                      this.setState(() => {
                        return {
                          JoVouchdata: fPro
                        };
                      });
                    } else if (unpaid.checked) {
                      let fPro = this.state.tempJodata.filter(data => {
                        if (data === "") {
                          return true;
                        } else if (parseInt(data.balance) > 0) {
                          return true;
                        }
                      });
              
                      this.setState(() => {
                        return {
                          JoVouchdata: fPro
                        };
                      });
                    }
                  } else {
                    if (oldest.checked) {
                      this.updateVouchData("/api/vouch?mode=oldest");
                    } else if (newest.checked) {
                      this.updateVouchData("/api/vouch?mode=newest");
                    } else if (low.checked) {
                      this.updateVouchData("/api/vouch?dir=low");
                    } else if (high.checked) {
                      this.updateVouchData("/api/vouch?dir=high");
                    } else if (paid.checked) {
                      let fPro = this.state.tempdata.filter(data => {
                        if (data.det.status == "0") {
                          return true;
                        }
                      });
              
                      this.setState(() => {
                        return {
                          data: fPro
                        };
                      });
                    } else if (unpaid.checked) {
                      let fPro = this.state.tempdata.filter(data => {
                        if (data === "") {
                          return true;
                        } else if (data.det.status != "0") {
                          return true;
                        }
                      });
              
                      this.setState(() => {
                        return {
                          data: fPro
                        };
                      });
                    }
                  }
                };
              
                Filter_Search = async () => {
                  let search = await document.getElementById("searc_vouchers").value.toLowerCase();
              
                  if (this.props.vouchPage === "jv") {
                    let fPro = this.state.tempJodata.filter(e => {
                      if (search === "") {
                        return true;
                      } else if (
                        e.debit_acc.toLowerCase().indexOf(search) === -1 &&
                        e.credit_acc.toLowerCase().indexOf(search) === -1 &&
                        e.billArr.join("").indexOf(search) === -1
                      ) {
                        return false;
                      } else {
                        return true;
                      }
                    });
              
                    this.setState(() => {
                      return {
                        JoVouchdata: fPro
                      };
                    });
                  } else {
                    let fPro = this.state.tempdata.filter(e => {
                      if (search === "") {
                        return true;
                      } else if (
                        e.det.customer.toLowerCase().indexOf(search) === -1 &&
                        e.det.supplier.toLowerCase().indexOf(search) === -1 &&
                        e.det.bill_num.indexOf(search) === -1
                      ) {
                        return false;
                      } else {
                        return true;
                      }
                    });
              
                    this.setState(() => {
                      return {
                        data: fPro
                      };
                    });
                  }
                };
              
                constructor(props) {
                  super(props);
              
                  this.state = {
                    addVouch: false,
                    addDebit: false,
                    data: [],
                    tempdata: [],
                    Debitdata: [],
                    JoVouchdata: [],
                    tempJodata: [],
                    Creditdata: [],
                    deleteUrl: null,
                    delete: false,
                    err_vouch: false,
                    err_jovouch: false,
                    err_debit: false,
                    err_credit: false
                  };
                  this.updateVouchData("/api/vouch?mode=newest");
              
                  this.updateJoVouchData("/api/jovouch?mode=newest");
                }
                updateVouchData = url => {
                  fetch(url)
                    .then(res => res.json())
                    .then(data => {
                      this.setState(() => {
                        return {
                          data: data,
                          tempdata: data
                        };
                      });
                    })
                    .catch(err => {
                      this.setState(() => {
                        return {
                          err_vouch: true
                        };
                      });
                    });
                };
                updateDebitData = () => {
                  fetch("/api/debit")
                    .then(res => res.json())
                    .then(data => {
                      this.setState(() => {
                        return {
                          Debitdata: data
                        };
                      });
                    })
                    .catch(err => {
                      this.setState(() => {
                        return {
                          err_debit: true
                        };
                      });
                    });
                };
                updateCreditData = () => {
                  fetch("/api/credit")
                    .then(res => res.json())
                    .then(data => {
                      this.setState(() => {
                        return {
                          Creditdata: data
                        };
                      });
                    })
                    .catch(err => {
                      this.setState(() => {
                        return {
                          err_credit: true
                        };
                      });
                    });
                };
              
                updateJoVouchData = url => {
                  fetch(url)
                    .then(res => res.json())
                    .then(data => {
                      this.setState(() => {
                        return {
                          JoVouchdata: data,
                          tempJodata: data
                        };
                      });
                    })
                    .catch(err => {
                      this.setState(() => {
                        return {
                          err_jovouch: true
                        };
                      });
                    });
                };
              
                render() {
                  return (
                    <div className="pro_compo">
                      <div className = "print_inv">
                        <Printed_Invoice />
                      </div>
                      <div className="nav_sec_trans nav_sec_vouch">
                        {this.state.delete && <Delete deleteHide={this.deleteHide} deleteUrl={this.state.deleteUrl} />}
                        <div className="nav_items">
                          <li
                            className={this.props.vouchPage === "pv" ? "black" : "grey"}
                            onClick={() => {
                              this.props.setVouchPage("pv");
                            }}
                          >
                            Sales Vouchers
                          </li>
                          <li
                            className={this.props.vouchPage === "jv" ? "black" : "grey"}
                            onClick={() => {
                              this.props.setVouchPage("jv");
                            }}
                          >
                            Journal Vouchers
                          </li>
                          <li
                            className={this.props.vouchPage === "dn" ? "black" : "grey"}
                            onClick={() => {
                              this.props.setVouchPage("dn");
                            }}
                          >
                            Debit Note
                          </li>
                          <li
                            className={this.props.vouchPage === "cn" ? "black" : "grey"}
                            onClick={() => {
                              this.props.setVouchPage("cn");
                            }}
                          >
                            Credit Note
                          </li>
                        </div>
                        <div className="other_det">
                          <div
                            className="add_vouch"
                            onClick={() => {
                              this.props.setPVoJVoDN(this.props.vouchPage, "add");
                            }}
                          >
                            + Add {this.props.vouchPage === "jv" && "Journal Vouchers"}
                            {this.props.vouchPage === "pv" && "Sales Vouchers"}
                            {this.props.vouchPage === "dn" && "Debit Note"}
                            {this.props.vouchPage === "cn" && "Credit Note"}
                          </div>
              
                          <img
                            src={ref}
                            alt=" "
                            onClick={this.props.ProOrAcc === "Products" ? this.props.getProducts : this.props.getAccounts}
                          />
                        </div>
                      </div>
              
                      <div className="filter_vouch">
                        <h2 className="filter_acc_h">Show Only</h2>
                        <hr />
                        <div className="search_line">
                          <input
                            type="search"
                            id="searc_vouchers"
                            placeholder="Search"
                            onChange={() => {
                              this.Filter_Search();
                            }}
                          />
                        </div>
                        <ul>
                          <li>
                            <input name="filter" value="newest" id="newest" onClick={this.ModeHandler} type="radio" />
                            Newest First
                          </li>
                          <li>
                            <input id="oldest" name="filter" value="oldest" type="radio" onChange={this.ModeHandler} />
                            Oldest First
                          </li>
                          <li>
                            <input id="high" type="radio" name="filter" value="high" onClick={this.ModeHandler} />
                            Amount(High to low)
                          </li>
                          <li>
                            <input id="low" type="radio" name="filter" value="low" onClick={this.ModeHandler} />
                            Amount(low to high)
                          </li>
                          <li>
                            <input id="paid" type="radio" name="filter" value="bank" onClick={this.ModeHandler} />
                            Paid
                          </li>
                          <li>
                            <input id="unpaid" type="radio" name="filter" value="bank" onClick={this.ModeHandler} />
                            Unpaid
                          </li>
                        </ul>
                      </div>
              
                      <div className="pro_compo_con">
                        <div className="pro_con_vouch">
                          {this.props.vouchPage === "pv" && (
                            <div className="vouchCon">
                              {false ? (
                                <div className="wrong_alert">Something Went Wrong....</div>
                              ) : (
                                this.state.data.map((e, i) => {
                                  if (!(e.det.type === "purchase")) {
                                    return;
                                  }
                                  if (e.det.IsDeleted) {
                                    return;
                                  }
                                  return (
                                    <DetCont
                                      i={i + 1}
                                      editF={this.props.setPVoJVoDN}
                                      EData={e}
                                      supplier={e.det.supplier}
                                      costumer={e.det.customer}
                                      date={e.det.bill_date}
                                      amt={e.det.totalAmt}
                                      bill_num={e.det.bill_num}
                                      id={e.det.id}
                                      deleteIt={this.deleteIt}
                                      status={e.det.status}
                                      which="pv"
                                    />
                                  );
                                })
                              )}
                            </div>
                          )}
              
                          {this.props.vouchPage === "dn" &&
                            (this.state.err_debit ? (
                              <div className="wrong_alert">Something Went Wrong....</div>
                            ) : (
                              <div className="vouchCon">
                                {this.state.data.map((e, i) => {
                                  if (e.det.type === "debit") {
                                    if (e.det.IsDeleted) {
                                      return;
                                    }
                                    return (
                                      <DetCont
                                        i={i + 1}
                                        editF={this.props.setPVoJVoDN}
                                        EData={e}
                                        supplier={e.det.supplier}
                                        costumer={e.det.customer}
                                        date={e.det.bill_date}
                                        amt={e.det.totalAmt}
                                        bill_num={e.det.bill_num}
                                        id={e.det.id}
                                        deleteIt={this.deleteIt}
                                        status={e.det.status}
                                        which="dn"
                                      />
                                    );
                                  }
                                })}
                              </div>
                            ))}
              
                          {this.props.vouchPage === "cn" &&
                            (this.state.err_credit ? (
                              <div className="wrong_alert">Something Went Wrong....</div>
                            ) : (
                              <div className="vouchCon">
                                {this.state.data.map((e, i) => {
                                  if (e.det.type === "credit") {
                                    if (e.det.IsDeleted) {
                                      return;
                                    }
                                    return (
                                      <DetCont
                                        i={i + 1}
                                        editF={this.props.setPVoJVoDN}
                                        EData={e}
                                        supplier={e.det.supplier}
                                        costumer={e.det.customer}
                                        date={e.det.bill_date}
                                        amt={e.det.totalAmt}
                                        bill_num={e.det.bill_num}
                                        id={e.det.id}
                                        deleteIt={this.deleteIt}
                                        status={e.det.status}
                                        which="cn"
                                      />
                                    );
                                  }
                                })}
                              </div>
                            ))}
              
                          {this.props.vouchPage === "jv" &&
                            (this.state.err_jovouch ? (
                              <div className="wrong_alert">Something Went Wrong....</div>
                            ) : (
                              <div className="vouchCon">
                                {this.state.JoVouchdata.error
                                  ? null
                                  : this.state.JoVouchdata.map((e, i) => {
                                      if (e.IsDeleted) {
                                        return;
                                      }
                                      return (
                                        <JoVouchDet
                                          bills={e.billArr}
                                          i={i + 1}
                                          amount={e.amount}
                                          balance={e.balance}
                                          date={e.bill_date}
                                          seller={e.debit_acc}
                                          cust={e.credit_acc}
                                          setPVoJVoDN={this.props.setPVoJVoDN}
                                          data={e}
                                          id={e.id}
                                          deleteIt={this.deleteIt}
                                          updateJoVouchData={this.updateJoVouchData}
                                          specificJoVouch={this.props.specificJoVouch}
                                          setjoBill={this.props.setjoBill}
                                        />
                                      );
                                    })}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                }
              }
              
              class DetCont extends React.Component {
                render() {
                  return (
                    <div className={this.props.deleted ? " det_cont_vouch   vouch_del" : "det_cont_vouch"}>
                      <div className="det_cont_left vouc_det_left">
                        <div className="acc_name_vouch">
                          <span className="acc_id_vouch">{this.props.i}. </span>
                          {this.props.supplier}
                          <span className="vouch_to">TO</span>
                          <span className="vouch_costumer_name">{this.props.costumer}</span>
                          {this.props.deleted && <span id="delete_msg">This will be permanently deleted in 10 days</span>}
                        </div>
                        <div className="vouch_bill_detail">
                          <div className="acc_adress">
                            <span className="acc_adress_head vouch_amount">Amount :</span> {this.props.amt}
                          </div>
                          <div className="acc_adress">
                            <span className="acc_adress_head">Biil No :</span> {this.props.bill_num}
                          </div>
                        </div>
                      </div>
                      <div className="det_cont_right_vouch vouch_right">
                        <div className=" vouch_status">
                          <span className="acc_right_vouch">Status:</span>{" "}
                          {this.props.status === "0" ? <span style={{ color: "green" }}>Paid</span> : "UnPaid"}
                        </div>
                        <div className="vouch_date">
                          <span className="acc_right_vouch"> Date:</span> {this.props.date}
                        </div>
                      </div>
              
                      <div className="det_cont_icons">
                        <div
                          onClick={() => {
                            this.props.editF(this.props.which, "edit", this.props.EData);
                          }}
                        >
                          <img src={pencil} alt=" " />
                        </div>
                        <div
                          onClick={() => {
                            this.props.deleteIt("/api/vouch/" + this.props.id);
                          }}
                        >
                          <img src={trash} alt=" " />
                        </div>
                      </div>
                    </div>
                  );
                }
              }
              
              class JoVouchDet extends React.Component {
                render() {
                  return (
                    <div className="det_cont_jovouch">
                      <div className="det_cont_right_jovouch_m">
                        <div className="vouch_bills">
                          <span className="acc_id_vouch">{this.props.id} </span>
                          <span className="acc_right_vouch">Bills:</span> {this.props.bills.join(" , ")}
                        </div>
                        <div className="acc_name_jovouch jovouch_det">
                          <span>{this.props.seller} </span>
                          <span className="vouch_to">TO</span>
                          <span className="vouch_costumer_name">{this.props.cust}</span>
                        </div>
                      </div>
                      <div className="det_cont_right_jovouch">
                        <div className=" vouch_bills">
                          <span className="acc_right_vouch">Pending Amount:</span> {this.props.balance}
                        </div>
                        <div className="vouch_bills">
                          <span className="acc_right_vouch"> Amount:</span> {this.props.amount}
                        </div>
                      </div>
                      <div className="det_cont_last_jovouch">
                        <div className=" vouch_status">
                          <span className="acc_right_vouch">Status:</span>{" "}
                          <span style={{ color: this.props.balance <= 0 ? "green" : "red" }}>
                            {this.props.balance <= 0 ? "Paid" : "UnPaid"}
                          </span>
                        </div>
                        <div className="vouch_date">
                          <span className="acc_right_vouch"> Date:</span> {this.props.date}
                        </div>
                      </div>
                      <div className="det_cont_icons">
                        <div
                          onClick={() => {
                            this.props.setPVoJVoDN("jv", "edit", this.props.data);
                            this.props.setjoBill(this.props.bills);
                          }}
                        >
                          <img src={pencil} alt=" " />
                        </div>
                        <div
                          onClick={() => {
                            this.props.deleteIt(`/api/jovouch/${this.props.id}`);
                          }}
                        >
                          <img src={trash} alt=" " />
                        </div>
                      </div>
                    </div>
                  );
                }
              }
              
              export default VouchCon;
              
                this.Filter_Search();
              }}
            />
          </div>
          <ul>
            <li>
              <input name="filter" value="newest" id="newest" onClick={this.ModeHandler} type="radio" />
              Newest First
            </li>
            <li>
              <input id="oldest" name="filter" value="oldest" type="radio" onChange={this.ModeHandler} />
              Oldest First
            </li>
            <li>
              <input id="high" type="radio" name="filter" value="high" onClick={this.ModeHandler} />
              Amount(High to low)
            </li>
            <li>
              <input id="low" type="radio" name="filter" value="low" onClick={this.ModeHandler} />
              Amount(low to high)
            </li>
            <li>
              <input id="paid" type="radio" name="filter" value="bank" onClick={this.ModeHandler} />
              Paid
            </li>
            <li>
              <input id="unpaid" type="radio" name="filter" value="bank" onClick={this.ModeHandler} />
              Unpaid
            </li>
          </ul>
        </div>

        <div className="pro_compo_con">
          <div className="pro_con_vouch">
            {this.props.vouchPage === "pv" && (
              <div className="vouchCon">
                {false ? (
                  <div className="wrong_alert">Something Went Wrong....</div>
                ) : (
                  this.state.data.map((e, i) => {
                    if (!(e.det.type === "purchase")) {
                      return;
                    }
                    if (e.det.IsDeleted) {
                      return;
                    }
                    return (
                      <DetCont
                        i={i + 1}
                        editF={this.props.setPVoJVoDN}
                        EData={e}
                        supplier={e.det.supplier}
                        costumer={e.det.customer}
                        date={e.det.bill_date}
                        amt={e.det.totalAmt}
                        bill_num={e.det.bill_num}
                        id={e.det.id}
                        deleteIt={this.deleteIt}
                        status={e.det.status}
                        which="pv"
                      />
                    );
                  })
                )}
              </div>
            )}

            {this.props.vouchPage === "dn" &&
              (this.state.err_debit ? (
                <div className="wrong_alert">Something Went Wrong....</div>
              ) : (
                <div className="vouchCon">
                  {this.state.data.map((e, i) => {
                    if (e.det.type === "debit") {
                      if (e.det.IsDeleted) {
                        return;
                      }
                      return (
                        <DetCont
                          i={i + 1}
                          editF={this.props.setPVoJVoDN}
                          EData={e}
                          supplier={e.det.supplier}
                          costumer={e.det.customer}
                          date={e.det.bill_date}
                          amt={e.det.totalAmt}
                          bill_num={e.det.bill_num}
                          id={e.det.id}
                          deleteIt={this.deleteIt}
                          status={e.det.status}
                          which="dn"
                        />
                      );
                    }
                  })}
                </div>
              ))}

            {this.props.vouchPage === "cn" &&
              (this.state.err_credit ? (
                <div className="wrong_alert">Something Went Wrong....</div>
              ) : (
                <div className="vouchCon">
                  {this.state.data.map((e, i) => {
                    if (e.det.type === "credit") {
                      if (e.det.IsDeleted) {
                        return;
                      }
                      return (
                        <DetCont
                          i={i + 1}
                          editF={this.props.setPVoJVoDN}
                          EData={e}
                          supplier={e.det.supplier}
                          costumer={e.det.customer}
                          date={e.det.bill_date}
                          amt={e.det.totalAmt}
                          bill_num={e.det.bill_num}
                          id={e.det.id}
                          deleteIt={this.deleteIt}
                          status={e.det.status}
                          which="cn"
                        />
                      );
                    }
                  })}
                </div>
              ))}

            {this.props.vouchPage === "jv" &&
              (this.state.err_jovouch ? (
                <div className="wrong_alert">Something Went Wrong....</div>
              ) : (
                <div className="vouchCon">
                  {this.state.JoVouchdata.error
                    ? null
                    : this.state.JoVouchdata.map((e, i) => {
                        if (e.IsDeleted) {
                          return;
                        }
                        return (
                          <JoVouchDet
                            bills={e.billArr}
                            i={i + 1}
                            amount={e.amount}
                            balance={e.balance}
                            date={e.bill_date}
                            seller={e.debit_acc}
                            cust={e.credit_acc}
                            setPVoJVoDN={this.props.setPVoJVoDN}
                            data={e}
                            id={e.id}
                            deleteIt={this.deleteIt}
                            updateJoVouchData={this.updateJoVouchData}
                            specificJoVouch={this.props.specificJoVouch}
                            setjoBill={this.props.setjoBill}
                          />
                        );
                      })}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

class DetCont extends React.Component {
  render() {
    return (
      <div className={this.props.deleted ? " det_cont_vouch   vouch_del" : "det_cont_vouch"}>
        <div className="det_cont_left vouc_det_left">
          <div className="acc_name_vouch">
            <span className="acc_id_vouch">{this.props.i}. </span>
            {this.props.supplier}
            <span className="vouch_to">TO</span>
            <span className="vouch_costumer_name">{this.props.costumer}</span>
            {this.props.deleted && <span id="delete_msg">This will be permanently deleted in 10 days</span>}
          </div>
          <div className="vouch_bill_detail">
            <div className="acc_adress">
              <span className="acc_adress_head vouch_amount">Amount :</span> {this.props.amt}
            </div>
            <div className="acc_adress">
              <span className="acc_adress_head">Biil No :</span> {this.props.bill_num}
            </div>
          </div>
        </div>
        <div className="det_cont_right_vouch vouch_right">
          <div className=" vouch_status">
            <span className="acc_right_vouch">Status:</span>{" "}
            {this.props.status === "0" ? <span style={{ color: "green" }}>Paid</span> : "UnPaid"}
          </div>
          <div className="vouch_date">
            <span className="acc_right_vouch"> Date:</span> {this.props.date}
          </div>
        </div>

        <div className="det_cont_icons">
          <div
            onClick={() => {
              this.props.editF(this.props.which, "edit", this.props.EData);
            }}
          >
            <img src={pencil} alt=" " />
          </div>
          <div
            onClick={() => {
              this.props.deleteIt("/api/vouch/" + this.props.id);
            }}
          >
            <img src={trash} alt=" " />
          </div>
        </div>
      </div>
    );
  }
}

class JoVouchDet extends React.Component {
  render() {
    return (
      <div className="det_cont_jovouch">
        <div className="det_cont_right_jovouch_m">
          <div className="vouch_bills">
            <span className="acc_id_vouch">{this.props.id} </span>
            <span className="acc_right_vouch">Bills:</span> {this.props.bills.join(" , ")}
          </div>
          <div className="acc_name_jovouch jovouch_det">
            <span>{this.props.seller} </span>
            <span className="vouch_to">TO</span>
            <span className="vouch_costumer_name">{this.props.cust}</span>
          </div>
        </div>
        <div className="det_cont_right_jovouch">
          <div className=" vouch_bills">
            <span className="acc_right_vouch">Pending Amount:</span> {this.props.balance}
          </div>
          <div className="vouch_bills">
            <span className="acc_right_vouch"> Amount:</span> {this.props.amount}
          </div>
        </div>
        <div className="det_cont_last_jovouch">
          <div className=" vouch_status">
            <span className="acc_right_vouch">Status:</span>{" "}
            <span style={{ color: this.props.balance <= 0 ? "green" : "red" }}>
              {this.props.balance <= 0 ? "Paid" : "UnPaid"}
            </span>
          </div>
          <div className="vouch_date">
            <span className="acc_right_vouch"> Date:</span> {this.props.date}
          </div>
        </div>
        <div className="det_cont_icons">
          <div
            onClick={() => {
              this.props.setPVoJVoDN("jv", "edit", this.props.data);
              this.props.setjoBill(this.props.bills);
            }}
          >
            <img src={pencil} alt=" " />
          </div>
          <div
            onClick={() => {
              this.props.deleteIt(`/api/jovouch/${this.props.id}`);
            }}
          >
            <img src={trash} alt=" " />
          </div>
        </div>
      </div>
    );
  }
}

export default VouchCon1;
