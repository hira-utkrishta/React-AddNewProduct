import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";

const MAX_IMAGE_SIZE = 100 * 1024; // 100KB

const NavBar = () => {
  const [formData, setFormData] = useState({
    Pname: "",
    Pprice: "",
    Image: null,
  });
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const increment = (index) => {
    const selectedProduct = { ...data[index] };

    const cartItemIndex = cartItems.findIndex(
      (item) => item.Pname === selectedProduct.Pname
    );

    if (cartItemIndex !== -1) {
      setCartItems((prevCartItems) => {
        const newCartItems = [...prevCartItems];
        newCartItems[cartItemIndex].counter += 1;
        newCartItems[cartItemIndex].totalPrice =
          newCartItems[cartItemIndex].Pprice *
          newCartItems[cartItemIndex].counter;
        return newCartItems;
      });
    } else {
      // Product is not in the cart, add it to the cart with initial quantity and total price
      setCartItems((prevCartItems) => [
        ...prevCartItems,
        { ...selectedProduct, counter: 1, totalPrice: selectedProduct.Pprice },
      ]);
    }

    selectedProduct.counter += 1;
    selectedProduct.totalPrice =
      parseFloat(selectedProduct.Pprice) * selectedProduct.counter; // Ensure numeric calculation

    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = selectedProduct;
      return newData;
    });
  };

  const decrement = (index) => {
    const selectedProduct = { ...data[index] };

    const cartItemIndex = cartItems.findIndex(
      (item) => item.Pname === selectedProduct.Pname
    );

    if (cartItemIndex !== -1) {
      setCartItems((prevCartItems) => {
        const newCartItems = [...prevCartItems];
        newCartItems[cartItemIndex].counter -= 1;
        newCartItems[cartItemIndex].totalPrice =
          newCartItems[cartItemIndex].Pprice *
          newCartItems[cartItemIndex].counter;

        if (newCartItems[cartItemIndex].counter === 0) {
          newCartItems.splice(cartItemIndex, 1);
        }

        return newCartItems;
      });
    }

    selectedProduct.counter -= 1;
    selectedProduct.totalPrice =
      parseFloat(selectedProduct.Pprice) * selectedProduct.counter; // Ensure numeric calculation

    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = selectedProduct;
      return newData;
    });
  };

  // const increment = (index) => {
  //   const selectedProduct = { ...data[index] };

  //   const cartItemIndex = cartItems.findIndex(
  //     (item) => item.Pname === selectedProduct.Pname
  //   );

  //   if (cartItemIndex !== -1) {
  //     setCartItems((prevCartItems) => {
  //       const newCartItems = [...prevCartItems];
  //       newCartItems[cartItemIndex].counter += 0.5;
  //       newCartItems[cartItemIndex].totalPrice =
  //         newCartItems[cartItemIndex].Pprice *
  //         newCartItems[cartItemIndex].counter;
  //       return newCartItems;
  //     });
  //   } else {
  //     // Product is not in the cart, add it to the cart with initial quantity and total price
  //     setCartItems((prevCartItems) => [
  //       ...prevCartItems,
  //       { ...selectedProduct, counter: 1, totalPrice: selectedProduct.Pprice },
  //     ]);
  //   }
  //   selectedProduct.counter += 1;
  //   selectedProduct.totalPrice =
  //     selectedProduct.Pprice * selectedProduct.counter;

  //   setData((prevData) => {
  //     const newData = [...prevData];
  //     newData[index] = selectedProduct;
  //     return newData;
  //   });
  // };

  // const decrement = (index) => {
  //   const selectedProduct = { ...data[index] };

  //   const cartItemIndex = cartItems.findIndex(
  //     (item) => item.Pname === selectedProduct.Pname
  //   );

  //   if (cartItemIndex !== -1) {
  //     setCartItems((prevCartItems) => {
  //       const newCartItems = [...prevCartItems];
  //       newCartItems[cartItemIndex].counter -= 0.5;
  //       newCartItems[cartItemIndex].totalPrice =
  //         newCartItems[cartItemIndex].Pprice *
  //         newCartItems[cartItemIndex].counter;

  //       if (newCartItems[cartItemIndex].counter === 0) {
  //         newCartItems.splice(cartItemIndex, 1);
  //       }

  //       return newCartItems;
  //     });
  //   }

  //   selectedProduct.counter -= 1;
  //   selectedProduct.totalPrice =
  //     selectedProduct.Pprice * selectedProduct.counter;

  //   setData((prevData) => {
  //     const newData = [...prevData];
  //     newData[index] = selectedProduct;
  //     return newData;
  //   });
  // };

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const productsWithCounter = storedProducts.map((product) => ({
      ...product,
      counter: 0,
    }));
    setData(productsWithCounter);
  }, []);

  const handleClose = () => {
    setShow(false);
    setFormData({ Pname: "", Pprice: "", Image: null });
  };

  const handleShow = () => setShow(true);

  const handleEntries = (e) => {
    const { name, value, files } = e.target;

    if (name === "Image") {
      if (files[0]) {
        if (files[0].size <= MAX_IMAGE_SIZE) {
          setFormData((prev) => ({ ...prev, Image: files[0] }));
        } else {
          toast.warning("Image size cannot be more than (100KB).");
        }
      } else {
        setFormData((prev) => ({ ...prev, Image: null }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.Pname || !formData.Pprice || !formData.Image) {
      toast.warning("All the fields required");
      return;
    }

    if (formData.Image.size > MAX_IMAGE_SIZE) {
      toast.warning("Image size cannot be more than (100KB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target.result;
      const newProduct = {
        ...formData,
        ImageDataUrl: imageDataUrl,
        counter: 0,
      };

      setData((prevData) => [...prevData, newProduct]);
      localStorage.setItem("products", JSON.stringify([...data, newProduct]));
      handleClose();
    };
    reader.readAsDataURL(formData.Image);
  };

  const deleteCartItem = (index) => {
    setCartItems((prevCartItems) => {
      const newCartItems = [...prevCartItems];
      newCartItems.splice(index, 1);
      return newCartItems;
    });

    setData((prevData) => {
      const newData = [...prevData];
      newData[index].counter = 0;
      return newData;
    });
  };
  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
      setTotalAmount(total);
    };

    calculateTotalAmount();
  }, [cartItems]);

  // useEffect(() => {
  //   const calculateTotalAmount = () => {
  //     let total = 0;
  //     for (const item of cartItems) {
  //       total += item.totalPrice;
  //     }
  //     setTotalAmount(total);
  //   };

  //   calculateTotalAmount();
  // }, [cartItems]);

  // const deleteCartItem = (index) => {
  //   setCartItems((prevCartItems) => {
  //     const newCartItems = [...prevCartItems];
  //     newCartItems.splice(index, 1);
  //     return newCartItems;
  //   });

  //   // Reset the counter for the deleted item in the data array
  //   setData((prevData) => {
  //     const newData = [...prevData];
  //     newData[index].counter = 0;
  //     return newData;
  //   });
  // };

  // const deleteCartItem = (index) => {
  //   setCartItems((prevCartItems) => {
  //     const newCartItems = [...prevCartItems];
  //     newCartItems.splice(index, 1); // Remove the item from the array
  //     return newCartItems;
  //   });
  // };

  // const deleteCartItem = (index) => {
  //   setCartItems((prevCartItems) => {
  //     const newCartItems = [...prevCartItems];
  //     newCartItems[index].counter = 0; // Set counter to 0 to remove the item
  //     return newCartItems;
  //   });
  // };
  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: "rgb(240, 230, 140)" }}>
        <Container>
          <Navbar.Brand href="#home">
            <h4>HomeFood</h4>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Button variant="success" onClick={handleShow}>
            Add Product
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Upload Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row className="mb-3">
                  <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Form.Label>
                      Product Image <span className="errmsg">*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      className="form-control" // Use className instead of class
                      controlId="formFileMultiple"
                      name="Image"
                      onChange={handleEntries} // Use onChange to handle file selection
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridproductName">
                    <Form.Label>
                      Product Name <span className="errmsg">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      class="form-control"
                      controlId="formGridproductName"
                      name="Pname"
                      value={formData.Pname}
                      onChange={handleEntries}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridproductPrice">
                    <Form.Label>
                      Product Price <span className="errmsg">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      class="form-control"
                      controlId="formGridproductPrice"
                      name="Pprice"
                      value={formData.Pprice}
                      onChange={handleEntries}
                    />
                  </Form.Group>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </Navbar>
      {data.length > 0 && (
        <div className="container mt-5">
          <h1 className="text-center">HomeFood</h1>
          <p className="text-center text-monospace">North Indian Cuisines</p>
          <div className="row">
            {data.map((product, index) => (
              <div className="col-md-3 mb-4 mt-2 " key={index}>
                <Card
                  style={{ width: "18rem" }}
                  className="mb-3 mx-2"
                  key={index}
                >
                  {product.ImageDataUrl && (
                    <Card.Img
                      variant="top"
                      src={product.ImageDataUrl}
                      alt={`Product ${index}`}
                    />
                  )}

                  <Card.Body>
                    <Card.Title className="text-center">
                      <h3>{product.Pname}</h3>
                    </Card.Title>
                    <Card.Text className="text-center">
                      <p>Price: ₹{product.Pprice}</p>
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <Button
                      style={{ width: "70px" }}
                      variant="danger"
                      onClick={() => decrement(index)}
                      disabled={product.counter === 0}
                    >
                      -
                    </Button>
                    <span style={{ margin: "10px" }}>{product.counter}</span>
                    <Button
                      style={{ width: "70px" }}
                      variant="success"
                      onClick={() => increment(index)}
                    >
                      +
                    </Button>
                  </Card.Footer>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 offset-md-1 ">
            <h2>Shopping Cart</h2>
            <p>
              Total Amount:
              {totalAmount.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(
                  (item, index) =>
                    item.counter > 0 && (
                      <tr key={index}>
                        <td>{item.Pname}</td>
                        <td>{item.totalPrice}</td>
                        {/* <td>{item.counter}</td> */}
                        <td>
                          {item.counter > 0 ? (
                            <span>{item.counter}</span>
                          ) : (
                            <span>0</span>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => deleteCartItem(index)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
