import React from 'react';
import pencil from '../img/pencil.svg';
import trash_can from '../img/trash.svg';
import cross from './../img/cancel.svg';

async function postData(url = '', data, m) {
	// Default options are marked with *
	const response = await fetch(url, {
		method: m, // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			// 'Content-Type': 'multipart/form-data'
			// 'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json'
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}

class AddVouch extends React.Component {
	enterError = (id) => {
		document.getElementById(id).style.borderColor = 'red';
		document.getElementById(id + '_error').style.display = 'block';
	};
	rmEnterError = (id) => {
		document.getElementById(id).style.borderColor = '#505050';
		document.getElementById(id + '_error').style.display = 'none';
	};

	setData = () => {
		let d = this.props.EData.det;
		document.querySelector('#vouch_bill_date').defaultValue = d.bill_date;
		document.querySelector('#vouch_type').defaultValue = d.type;
		document.querySelector('#vouch_bill_no').defaultValue = d.bill_num;
		document.querySelector('#vouch_gr_no').defaultValue = d.g_r_num;
		document.querySelector('#vouch_transport_name').defaultValue = d.transport_name;
		document.querySelector('#vouch_sup').defaultValue = d.supplier;
		document.querySelector('#vouch_sup_agent').defaultValue = d.supplier_agent;
		document.querySelector('#vouch_comission').defaultValue = d.set_commission;
		document.querySelector('#vouch_customer').defaultValue = d.customer;
		if (d.supplier_agent2) {
			this.setState({ subAgent: true });
		}
		document.querySelector('#vouch_gst').defaultValue = parseInt(d.gst);
		let arr = [];
		let i = this.props.EData.product;

		i.map((e, index) => {
			let amt = parseInt(e.quantity) * parseInt(e.rate);
			let gamt = parseInt(amt);
			amt = parseInt(amt) - parseInt(amt) * parseInt(e.dicon) / 100;

			let a = {
				dicon: e.dicon,
				hsn_num: e.hsn_num,
				product_name: e.product_name,
				rate: e.rate,
				quantity: e.quantity,
				g_amount: gamt,
				amount: amt
			};
			arr.push(a);
		});

		this.setState({ items: arr });
	};

	updateTotal = () => {
		let total = 0;
		let g_amount = 0;
		let gst = parseInt(document.getElementById('vouch_gst').value);
		let disAmt = 0;
		this.state.items.map((e) => {
			g_amount = parseInt(g_amount) + parseInt(e.g_amount);
			disAmt = parseInt(disAmt) + parseInt(e.g_amount) - parseInt(e.amount);
			total = parseInt(total) + parseInt(e.amount);
		});
		total = parseInt(total) + parseInt(total) * parseInt(gst) / 100;
		this.setState({ totalAmt: total, grossAmt: g_amount, disAmt: disAmt });
	};

	async addVouch() {
		let bool = false;
		if (document.getElementById('vouch_bill_no').value === '') {
			this.enterError('vouch_bill_no');
			bool = true;
		} else {
			this.rmEnterError('vouch_bill_no');
		}

		if (document.getElementById('vouch_sup').value === 'None') {
			this.enterError('vouch_sup');
			bool = true;
		} else {
			this.rmEnterError('vouch_sup');
		}
		if (document.getElementById('vouch_customer').value === 'None') {
			this.enterError('vouch_customer');
			bool = true;
		} else {
			this.rmEnterError('vouch_customer');
		}
		if (bool) {
			return;
		}
		let bill_date = document.querySelector('#vouch_bill_date').value;
		let type = document.querySelector('#vouch_type').value;
		let bill_num = document.querySelector('#vouch_bill_no').value;
		let g_r_num = document.querySelector('#vouch_gr_no').value;
		let transport_name = document.querySelector('#vouch_transport_name').value;
		let supplier = document.querySelector('#vouch_sup').value;
		let supplier_agent = document.querySelector('#vouch_sup_agent').value;
		let set_commission = document.querySelector('#vouch_comission').value;
		let customer = document.querySelector('#vouch_customer').value;
		let supplier_agent2 = null;
		if (document.getElementById('vouch_sup_agent2')) {
			supplier_agent2 = document.querySelector('#vouch_sup_agent2').value;
		}
		let gst = document.querySelector('#vouch_gst').value;
		let Vdata = {
			bill_date,
			type,
			bill_num,
			g_r_num,
			transport_name,
			supplier,
			supplier_agent,
			supplier_agent2,
			gst,
			set_commission,
			customer,
			items: this.state.items,
			totalAmt: this.state.totalAmt
		};
		let m = this.props.mode === 'edit' ? 'PUT' : 'POST';
		let url = this.props.mode === 'edit' ? '/api/vouch/' + this.props.EData.det.id : '/api/vouch';
		const isTrue = await postData(url, Vdata, m);
		if (isTrue) {
			this.props.rm();
		} else {
			alert('Unable to save. Please Try again');
		}
	}

	getName() {
		fetch('/api/profile/name', {
			method: 'get',
			headers: { 'Content-Type': 'application/json' }
		})
			.then((r) => r.json())
			.then((data) => {
				if (data.name) {
					this.setState(() => {
						return {
							name: data.name
						};
					});
				}
			})
			.catch((error) => {
				alert(error);
			});
	}

	addPro = async () => {};

	async vochAddPro() {
		let pro_name = document.querySelector('#vouch_pro_item').value;
		let isIn = this.state.products.find((element) => element.product_name === pro_name);
		console.log(isIn);

		if (!!!isIn) {
			let pro_name = document.querySelector('#vouch_pro_item').value;
			let hsn_num = document.querySelector('#vouch_hsn_num').value;
			if (!!!hsn_num) {
				alert('Please Enter HSN number');
				return false;
			}
			let data = {
				product_name: pro_name,
				hsn_num: hsn_num
			};

			await fetch('/api/products', {
				method: 'POST', // *GET, POST, PUT, DELETE, etc.

				headers: {
					'Content-Type': 'application/json'
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: JSON.stringify(data) // body data type must match "Content-Type" header
			})
				.then((res) => res.json())
				.then((r) => {
					if (r.product) {
					} else {
						alert('Cannot Add Product Please Try Later');
						return;
					}
				})
				.catch((err) => {
					console.log(err);
					alert('Cannot Add Product Please Try Later');
					return;
				});
		}
		document.querySelector('#vouch_pro_item').value = '';
		if (!pro_name) return;
		let vouch_quantity = document.querySelector('#vouch_quantity').value;
		document.querySelector('#vouch_quantity').value = 1;

		let vouch_dicon = document.querySelector('#vouch_dicon').value;
		document.querySelector('#vouch_dicon').value = this.state.defaultDiscon;
		let vouch_rate = document.querySelector('#vouch_rate').value;
		document.querySelector('#vouch_rate').value = 1;

		let hsn_num = document.getElementById('vouch_hsn_num').value;
		document.getElementById('vouch_hsn_num').value = '';

		let dicon = parseInt(vouch_dicon) / 100;
		let v_amount = parseInt(vouch_rate) * parseInt(vouch_quantity);
		let g_amount = v_amount;
		v_amount = v_amount - v_amount * dicon;
		let item = {
			product_name: pro_name,
			quantity: vouch_quantity,
			dicon: vouch_dicon,
			rate: vouch_rate,
			amount: v_amount,
			hsn_num: hsn_num,
			g_amount
		};

		let arr = this.state.items;
		arr.push(item);
		this.setState({
			items: arr
		});
		this.updateTotal();
		return;
	}

	removeItem = (index) => {
		let arr = this.state.items;
		arr.splice(index, 1);

		this.setState((prevState) => {
			return {
				items: arr
			};
		});
		this.updateTotal();
	};

	editItem = (index) => {
		let pro_name = document.querySelector('#vouch_pro_item');

		let vouch_quantity = document.querySelector('#vouch_quantity');
		let vouch_dicon = document.querySelector('#vouch_dicon');
		let vouch_rate = document.querySelector('#vouch_rate');
		let hsn_num = document.getElementById('vouch_hsn_num');

		pro_name.value = this.state.items[index].product_name;
		vouch_quantity.value = this.state.items[index].quantity;
		vouch_dicon.value = this.state.items[index].dicon;
		vouch_rate.value = this.state.items[index].rate;
		hsn_num.value = this.state.items[index].hsn_num;

		this.setState(() => {
			return {
				editItem: index
			};
		});
	};

	editPro = () => {
		let vouch_quantity = document.querySelector('#vouch_quantity').value;
		let vouch_dicon = document.querySelector('#vouch_dicon').value;
		let vouch_rate = document.querySelector('#vouch_rate').value;
		let pro_name = document.getElementById('vouch_pro_item').value;
		let hsn_num = document.getElementById('vouch_hsn_num').value;

		document.querySelector('#vouch_pro_item').value = '';

		document.querySelector('#vouch_quantity').value = 1;

		document.querySelector('#vouch_dicon').value = 5;
		document.querySelector('#vouch_rate').value = 1;

		document.getElementById('vouch_hsn_num').value = '';
		let dicon = parseInt(vouch_dicon) / 100;
		let v_amount = parseInt(vouch_rate) * parseInt(vouch_quantity);
		let g_amt = parseInt(v_amount);
		v_amount = v_amount - v_amount * dicon;
		v_amount = v_amount.toFixed(2);
		let arr = this.state.items;

		arr[this.state.editItem].product_name = pro_name;
		arr[this.state.editItem].quantity = vouch_quantity;
		arr[this.state.editItem].dicon = vouch_dicon;
		arr[this.state.editItem].rate = vouch_rate;
		arr[this.state.editItem].hsn_num = hsn_num;
		arr[this.state.editItem].amount = v_amount;
		arr[this.state.editItem].g_amount = g_amt;

		this.setState(() => {
			return {
				items: arr,
				editItem: -1
			};
		});
		this.updateTotal();
	};

	filterPro = () => {
		document.getElementById('pro_list').style.display = 'block';
		let temp = document.getElementById('vouch_pro_item').value.toLowerCase();

		let arr = this.state.products.filter((e) => {
			if (temp.length === 0) {
				return true;
			}
			if (e.product_name.toLowerCase().indexOf(temp) !== -1) {
				return true;
			} else return false;
		});

		this.setState({ pro: arr });
	};

	getProducts() {
		fetch('/api/products', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			}
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.Products) {
					this.setState(() => {
						return {
							products: data.Products
						};
					});
				}
			})
			.catch((err) => {
				// alert(err)
			});
	}
	getAccounts() {
		fetch('/api/accounts', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			}
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.accounts) {
					this.setState(() => {
						return {
							accounts: data.accounts
						};
					});
				}
			})
			.catch((err) => {
				// aldert(err)
			});
	}
	crossPro = () => {
		this.setState({ addPro: false });
	};

	selectAllText = () => {
		document.getElementById('vouch_pro_item').select();
	};

	constructor(props) {
		super(props);
		this.vochAddPro = this.vochAddPro.bind(this);
		this.getProducts = this.getProducts.bind(this);
		this.getAccounts = this.getAccounts.bind(this);
		this.state = {
			products: [],
			accounts: [],
			subAgent: false,
			items: [],
			name: null,
			editItem: -1,
			totalAmt: 0,
			grossAmt: 0,
			disAmt: 0,
			pro: [],
			gst: 5,
			defaultDiscon: 0
		};
		this.getProducts();
		this.getAccounts();
		if (this.props.mode === 'edit') {
			this.setState({ subAgent: true });
		}
		this.getName();
	}

	componentDidMount() {
		let today = new Date();

		document.getElementById('vouch_bill_date').valueAsDate = today;
		document.getElementById('pro_list').style.display = 'none';
		if (this.props.mode === 'edit') {
			this.setData();
			setTimeout(() => {
				this.updateTotal();
			}, 500);
		}
	}
	render() {
		return (
			<div className="add_vouch_con">
				<div className="add_pro_head">
					<h1>{this.props.which === "pv" && "Add Purchase Vouch"}
					{this.props.which === "dn" && "Add Debit Note"}
					{this.props.which === "cn" && "Add Credit Note"}</h1>

					<div className="add_vouch_right_btns">
						<p
							onClick={() => {
								this.addVouch();
							}}
						>
							Save
						</p>
						<img onClick={this.props.rm} src={cross} alt="" />
					</div>
				</div>

				<div className="vouch_body">
					<div className="vouch_body_left">
						<div className="vouch_body_left_top">
							<form action="/api/vouch" id="vouch_det" method="post">
								<div className="vouch_details">
									<div className="vouch_si">
										<span>Bill Date</span>
										<br />
										<input type="date" name="vouch_bill_date" id="vouch_bill_date" />
									</div>
									<div className="vouch_si">
										<span>Type</span>
										<br />
										<select name="vouch_type" disabled id="vouch_type">
											<option
												value="purchase"
												selected={this.props.which === 'pv' ? true : false}
											>
												Purchase
											</option>
											<option
												value="credit"
												selected={this.props.which === 'cn' ? true : false}
											>
												Credit
											</option>
											<option
												value="debit"
												selected={this.props.which === 'dn' ? true : false}
											>
												Debit
											</option>
										</select>
									</div>

									<div className="vouch_si">
										<span>Bill No.</span>
										<br />
										<input
											onBlur={() => {
												if (document.getElementById('vouch_bill_no').value !== '') {
													this.rmEnterError('vouch_bill_no');
												}
											}}
											type="number"
											name="vouch_bill_no"
											id="vouch_bill_no"
										/>
										<p className="error_p" id="vouch_bill_no_error">
											{' '}
											Please Enter Bill Number
										</p>
									</div>

									<div className="vouch_si">
										<span>G. R. No.</span>
										<br />
										<input type="number" name="vouch_gr_no" id="vouch_gr_no" />
									</div>

									<div className="vouch_si">
										<span>Transport Name</span>
										<br />

										<select name="vouch_sup" id="vouch_transport_name">
											<option>None</option>
											{this.state.accounts &&
												this.state.accounts.map((acc, i) => {
													if (acc.acc_type === 'transport') {
														return (
															<option
																selected={
																	this.props.mode === 'edit' &&
																	this.props.EData.det.transport_name ===
																		acc.acc_name ? (
																		true
																	) : (
																		false
																	)
																}
																key={i}
																value={acc.acc_name}
															>
																{acc.acc_name}
															</option>
														);
													} else {
														return null;
													}
												})}
										</select>
									</div>
									<div className="vouch_si">
										<span>Supplier/Seller</span>
										<br />
										<select
											onFocus={() => {
												let arr = this.state.accounts;
												arr = arr.sort();
												this.setState({ accounts: arr });
											}}
											onBlur={() => {
												if (document.getElementById('vouch_sup').value !== 'None') {
													this.rmEnterError('vouch_sup');
												}
											}}
											name="vouch_sup"
											id="vouch_sup"
										>
											<option>None</option>
											{this.state.accounts &&
												this.state.accounts.map((acc, i) => {
													if (acc.acc_type === 'creditors' || acc.acc_type === 'debtors') {
														return (
															<option
																selected={
																	this.props.mode === 'edit' &&
																	this.props.EData.det.supplier === acc.acc_name ? (
																		true
																	) : (
																		false
																	)
																}
																key={i}
																value={acc.acc_name}
																disabled={
																	document.getElementById('vouch_customer').value ===
																	acc.acc_name ? (
																		true
																	) : (
																		false
																	)
																}
															>
																{acc.acc_name}
															</option>
														);
													} else {
														return null;
													}
												})}
										</select>
										<p className="error_p" id="vouch_sup_error">
											{' '}
											Please Enter Supplier/Seller Name
										</p>
									</div>

									<div className="vouch_si">
										<span>Supplier Agent</span>
										<br />
										<select name="vouch_sup_agent" id="vouch_sup_agent">
											<option defaultChecked value={this.state.name}>
												{this.state.name}
											</option>
											<option value={null}>None</option>
										</select>
									</div>

									<div className="vouch_si">
										<span>Set Commission</span>
										<br />
										<input
											type="number"
											name="vouch_comission"
											id="vouch_comission"
											defaultValue={
												this.props.mode === 'edit' ? this.props.EData.det.set_commission : '1'
											}
										/>
									</div>
									<div id="gst_con" className="vouch_si">
										<span>GST</span>
										<br />
										<span id="percentage">%</span>
										<input
											defaultValue={this.props.mode === 'edit' ? this.props.EData.det.gst : 5}
											type="number"
											name="vouch_gst"
											id="vouch_gst"
											onBlur={() => {
												if (document.getElementById('vouch_gst').value === '') {
													document.getElementById('vouch_gst').value = 0;
												}
												this.setState({ gst: document.getElementById('vouch_gst').value });
												this.updateTotal();
											}}
										/>
									</div>
								</div>

								<div className="vouch_customer">
									<div className="vouch_si">
										<span>Customer/Buyer</span>
										<br />
										<select
											onFocus={() => {
												let arr = this.state.accounts;
												arr = arr.sort();
												this.setState({ accounts: arr });
											}}
											onBlur={() => {
												if (document.getElementById('vouch_customer').value !== 'None') {
													this.rmEnterError('vouch_customer');
												}
											}}
											name="customer"
											id="vouch_customer"
										>
											<option>None</option>
											{this.state.accounts &&
												this.state.accounts.map((acc, i) => {
													if (acc.acc_type === 'creditors' || acc.acc_type === 'debtors') {
														return (
															<option
																key={i}
																value={acc.acc_name}
																selected={
																	this.props.mode === 'edit' &&
																	this.props.EData.det.customer === acc.acc_name ? (
																		true
																	) : (
																		false
																	)
																}
																disabled={
																	document.getElementById('vouch_sup').value ===
																	acc.acc_name ? (
																		true
																	) : (
																		false
																	)
																}
															>
																{acc.acc_name}
															</option>
														);
													} else {
														return null;
													}
												})}
										</select>
										<p className="error_p" id="vouch_customer_error">
											{' '}
											Please Enter Customer Name
										</p>
									</div>
									{this.state.subAgent ? (
										<div className="vouch_si">
											<span>Sub Agent</span>
											<br />
											<select name="vouch_sup_agent" id="vouch_sup_agent2">
												<option>None</option>
												{this.state.accounts &&
													this.state.accounts.map((acc, i) => {
														if (acc.acc_type === 'agent') {
															return (
																<option
																	key={i}
																	selected={
																		this.props.mode === 'edit' &&
																		this.props.EData.det.supplier_agent2 ===
																			acc.acc_name ? (
																			true
																		) : (
																			false
																		)
																	}
																	value={acc.acc_name}
																>
																	{acc.acc_name}
																</option>
															);
														} else {
															return null;
														}
													})}
											</select>
										</div>
									) : (
										<span
											style={{
												marginLeft: '20px',
												cursor: 'pointer'
											}}
											onClick={() => {
												this.setState({ subAgent: true });
											}}
											id="add_sub_agent"
										>
											{' '}
											+ Add Sub Agent
										</span>
									)}
								</div>
							</form>
						</div>

						<div className="vouch_body_middle">
							<div className="vouch_si" id="vouch_pro_con">
								<span>Product / Item</span>
								<br />
								<input
									name="vouch_pro_item"
									id="vouch_pro_item"
									onChange={this.filterPro}
									onFocus={() => {
										this.filterPro();
										this.selectAllText();
									}}
									autoComplete="off"
									onBlur={() => {
										setTimeout(() => {
											document.getElementById('pro_list').style.display = 'none';
										}, 500);
									}}
								/>
								<ul id="pro_list">
									{this.state.pro.map((pro, index) => {
										console.log(pro);
										return (
											<li
												key={index}
												onClick={() => {
													document.getElementById('vouch_pro_item').value = pro.product_name;
													document.getElementById('vouch_hsn_num').value = pro.hsn_num;
													document.getElementById('pro_list').style.display = 'none';
												}}
											>
												{pro.product_name}
											</li>
										);
									})}
								</ul>
							</div>

							<div className="vouch_si">
								<span>HSN No.</span>
								<br />
								<input type="text" name="vouch_hsn_num" id="vouch_hsn_num" />
							</div>
							<div className="vouch_si">
								<span>Quantity</span>
								<br />
								<input
									onFocus={(e) => e.target.select()}
									type="number"
									name="vouch_quantity"
									id="vouch_quantity"
									defaultValue="1"
								/>
							</div>
							<div className="vouch_si">
								<span>Rate</span>
								<br />
								<input
									onFocus={(e) => e.target.select()}
									type="number"
									name="vouch_rate"
									id="vouch_rate"
									defaultValue="1"
								/>
							</div>
							<div className="vouch_si" id="gst_con">
								<span>Discount</span>
								<br />
								<span id="percentage">%</span>
								<input
									onBlur={() => {
										if (document.getElementById('vouch_dicon').value === '') {
											document.getElementById('vouch_dicon').value = 0;
										}
										this.setState({ defaultDiscon: document.getElementById('vouch_dicon').value });
									}}
									type="number"
									name="vouch_dicon"
									onFocus={(e) => e.target.select()}
									id="vouch_dicon"
									defaultValue={this.state.defaultDiscon}
								/>
							</div>
							<div className="vouch_si">
								<button
									id="vouch_add_btn"
									onClick={this.state.editItem === -1 ? this.vochAddPro : this.editPro}
								>
									{this.state.editItem === -1 ? 'Add' : 'Edit'}
								</button>
							</div>
						</div>

						<div className="vouch_table_con">
							<table id="vouch_table">
								<thead>
									<tr>
										<th>S.No.</th>
										<th>Product/Item</th>
										<th>HSN No.</th>
										<th>Quantity</th>
										<th>Rate</th>
										<th>Discount</th>

										<th>Amount</th>
										<th>Edit</th>
										<th>Delete</th>
									</tr>
								</thead>
								<tbody>
									{this.state.items.map((i, index) => {
										return (
											<tr key={index}>
												<td className="tbtn">{index + 1}</td>
												<td>{i.product_name}</td>
												<td>{i.hsn_num}</td>
												<td>{i.quantity}</td>
												<td>{i.rate}</td>
												<td>{i.dicon}%</td>

												<td>{i.amount}</td>
												<td
													className="tbtn"
													onClick={() => {
														this.editItem(index);
													}}
												>
													<img className="vouch_edit_pencil" src={pencil} />
												</td>
												<td
													className="tbtn"
													onClick={() => {
														this.removeItem(index);
													}}
												>
													<img className="vouch_trash_can" src={trash_can} />
												</td>
											</tr>
										);
									})}
									{this.state.items.length === 0 && (
										<tr>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
										</tr>
									)}
									{this.state.items.length < 2 && (
										<tr>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
										</tr>
									)}
									{this.state.items.length < 3 && (
										<tr>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
										</tr>
									)}
									{this.state.items.length < 4 && (
										<tr>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
										</tr>
									)}
									{this.state.items.length < 5 && (
										<tr>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
										</tr>
									)}
									{this.state.items.length < 6 && (
										<tr>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
											<td> </td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>

					<div className="vouch_body_right">
						<div className="right items vouch_body">
							<div className="vouch_num_items">
								<span>No. of items : </span>
								<strong>{this.state.items.length}</strong>
								<br />
								<span> Gross Amount :</span>
								<strong> {this.state.grossAmt}</strong>
								<br />
								<span> Discount :</span>
								<strong> {this.state.disAmt}</strong>
								<br />
								<span> GST :</span>
								<strong> {this.state.gst}%</strong>
								<br />
								<span> Total Amount :</span>
								<strong> {this.state.totalAmt}</strong>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddVouch;
