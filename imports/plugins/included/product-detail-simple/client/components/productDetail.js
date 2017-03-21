import React, { Component, PropTypes } from "react";
import {
  Button,
  Currency,
  Divider,
  DropDownMenu,
  FieldGroup,
  MenuItem,
  Translation,
  Toolbar,
  ToolbarGroup
} from "/imports/plugins/core/ui/client/components/";
import {
  AddToCartButton,
  ProductMetadata,
  ProductTags,
  ProductField
} from "./";
import { AlertContainer } from "/imports/plugins/core/ui/client/containers";
import { PublishContainer } from "/imports/plugins/core/revisions";
import { Reaction } from "/client/api";
import { Audio, Video, Software, Book } from "/lib/collections";
import "./digitalProducts.css";

class ProductDetail extends Component {
  constructor(props) {
   super(props);
   this.state = {
     digital: this.props.isDigital,
     cartQuantityType: "number",
     categoryValue: "",
     downloadUrl: "",
     fileId: this.props.product.productFileId
   };
   this.switchDigital = this.switchDigital.bind(this);
   this.handleCategoryStateChange = this.handleCategoryStateChange.bind(this);
   this.handleUploadClick = this.handleUploadClick.bind(this);
   this.deleteFile = this.deleteFile.bind(this);
 }

  get tags() {
    return this.props.tags || [];
  }

  get product() {
    return this.props.product || {};
  }

  get editable() {
    return this.props.editable;
  }

  handleVisibilityChange = (event, isProductVisible) => {
    if (this.props.onProductFieldChange) {
      this.props.onProductFieldChange(this.product._id, "isVisible", isProductVisible);
    }
  }

  handlePublishActions = (event, action) => {
    if (action === "delete" && this.props.onDeleteProduct) {
      this.props.onDeleteProduct(this.product._id);
    }
  }

  renderToolbar() {
    if (this.props.hasAdminPermission) {
      return (
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <Translation defaultValue="Product Management" i18nKey="productDetail.productManagement"/>
          </ToolbarGroup>
          <ToolbarGroup>
            <DropDownMenu
              buttonElement={<Button label="Switch" />}
              onChange={this.props.onViewContextChange}
              value={this.props.viewAs}
            >
              <MenuItem label="Administrator" value="administrator" />
              <MenuItem label="Customer" value="customer" />
            </DropDownMenu>
          </ToolbarGroup>
          <ToolbarGroup lastChild={true}>
            <PublishContainer
              documentIds={[this.product._id]}
              documents={[this.product]}
              onVisibilityChange={this.handleVisibilityChange}
              onAction={this.handlePublishActions}
            />
          </ToolbarGroup>
        </Toolbar>
      );
    }

    return null;
  }

  switchDigital(e) {
    this.setState({digital: e.target.checked});
    const productId = this.props.product._id;
    const checked = e.target.checked;
    this.props.onProductFieldChange(productId, "isDigital", checked);
    this.props.changeParentIsDigitalState(e.target.checked);
    if (!this.state.digital) {
      this.setState({cartQuantityType: "hidden"});
    } else {
      this.setState({cartQuantityType: "number"});
    }
  }

  renderInputToggle() {
    if (this.props.hasAdminPermission) {
      return (
        <div className="switch-middle">
          <b className="switch-text">Physical Product</b>
            <label className="switch">
              <input id="digital" type="checkbox" defaultChecked={this.state.digital} onChange={this.switchDigital}/>
              <div className="slider round"/>
            </label>
          <b className="switch-text">Digital Product</b>
        </div>
      );
    }

    return null;
  }

  handleCategoryStateChange(e) {
    const value = e.target.value;
    this.setState({categoryValue: value});
  }

  handleUploadClick(e) {
    const files = new FS.File(e.target.files[0]);
    files.metadata = {
    productId: this.props.product._id,
    ownerId: Meteor.userId(),
    shopId: Reaction.getShopId()
    };

    const insertDigitalFile = (db, Alerts) => {
      db.insert(files, (err, file) => {
        if (err) {
          return Alerts.toast("Something went wrong", "warning");
        }
        if (file) {
          this.setState({fileId: file._id});
          const digitalInfo = {
            fileId: file._id,
            category: this.state.categoryValue
          };

          this.props.onProductFieldChange(this.props.product._id, "productFileId", file._id);
          this.props.onProductFieldChange(this.props.product._id, "digitalInfo", digitalInfo);
          return Alerts.toast("File successfully uploaded", "success");
          }
        return "File Insert Failed";
      });
    };
    if (this.state.categoryValue === "audio") {
      return insertDigitalFile(Audio, Alerts);
    } else if (this.state.categoryValue === "video") {
      return insertDigitalFile(Video, Alerts);
    } else if (this.state.categoryValue === "book") {
      return insertDigitalFile(Book, Alerts);
    } else if (this.state.categoryValue === "software") {
      return insertDigitalFile(Software, Alerts);
    }
    return "Invalid Category Specified";
  }
  get download() {
    const result = Audio.findOne({_id: this.state.fileId});
    return (new FS.File(result).url());
  }

  deleteFile() {
    if (this.state.fileId) {
      return (
        <button className="btn btn-danger no-round">Delete Uploaded File</button>
      );
    }
    return null;
  }

  renderDigitalDetails() {
    if (this.props.hasAdminPermission && this.state.digital) {
      return (
        <div>
          <Divider
            label="Digital product options"
          />
          <FieldGroup
            componentClass="select"
            name="digitalCategory"
            onChange={this.handleCategoryStateChange}
          >
            <option value="">Choose a category..</option>
            <option value="audio">Audio</option>
            <option value="book">Book</option>
            <option value="video">Video</option>
            <option value="software">Software</option>
          </FieldGroup>

          <input className="btn btn-success hidden" type="file" id="uploadFile" onChange={this.handleUploadClick}/>
          <label className="btn btn-success no-round" htmlFor="uploadFile">Upload Digital product</label>
          {this.deleteFile()}
        </div>
      );
    }
      return null;
    }

  render() {
    return (
      <div className="" style={{position: "relative"}}>
        {this.renderToolbar()}

        <div className="container-main container-fluid pdp-container" itemScope itemType="http://schema.org/Product">
          <AlertContainer placement="productManagement" />

          <header className="pdp header">
            <ProductField
              editable={this.editable}
              fieldName="title"
              fieldTitle="Title"
              element={<h1 />}
              onProductFieldChange={this.props.onProductFieldChange}
              product={this.product}
              textFieldProps={{
                i18nKeyPlaceholder: "productDetailEdit.title",
                placeholder: "Title"
              }}
            />

            <ProductField
              editable={this.editable}
              fieldName="pageTitle"
              fieldTitle="Sub Title"
              element={<h2 />}
              onProductFieldChange={this.props.onProductFieldChange}
              product={this.product}
              textFieldProps={{
                i18nKeyPlaceholder: "productDetailEdit.pageTitle",
                placeholder: "Subtitle"
              }}
            />
          </header>


          <div className="pdp-content">
            <div className="pdp column left pdp-left-column" id="product-images">
              {this.props.mediaGalleryComponent}
              <ProductTags editable={this.props.editable} product={this.product} tags={this.tags} />
              <ProductMetadata editable={this.props.editable} product={this.product} />
            </div>

            <div className="pdp column right pdp-right-column">


              <div className="pricing">
                <div className="left">
                  <span className="price">
                    <span id="price">
                      <Currency amount={this.props.priceRange} />
                    </span>
                  </span>
                </div>
                <div className="right">
                  {this.props.socialComponent}
                </div>
              </div>


              <div className="vendor">
                <ProductField
                  editable={this.editable}
                  fieldName="vendor"
                  fieldTitle="Vendor"
                  onProductFieldChange={this.props.onProductFieldChange}
                  product={this.product}
                  textFieldProps={{
                    i18nKeyPlaceholder: "productDetailEdit.vendor",
                    placeholder: "Vendor"
                  }}
                />
              </div>

              <div className="pdp product-info">
                <ProductField
                  editable={this.editable}
                  fieldName="description"
                  fieldTitle="Description"
                  multiline={true}
                  onProductFieldChange={this.props.onProductFieldChange}
                  product={this.product}
                  textFieldProps={{
                    i18nKeyPlaceholder: "productDetailEdit.description",
                    placeholder: "Description"
                  }}
                />
                {this.renderInputToggle()}
                {this.renderDigitalDetails()}
              </div>

              <div className="options-add-to-cart">
                {this.props.topVariantComponent}
              </div>
              <hr />
              <div>
                <AlertContainer placement="productDetail" />
                <AddToCartButton
                  cartQuantity={this.props.cartQuantity}
                  inputType={this.state.cartQuantityType}
                  onCartQuantityChange={this.props.onCartQuantityChange}
                  onClick={this.props.onAddToCart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProductDetail.propTypes = {
  cartQuantity: PropTypes.number,
  changeParentIsDigitalState: PropTypes.func,
  editable: PropTypes.bool,
  hasAdminPermission: PropTypes.bool,
  isDigital: PropTypes.bool,
  mediaGalleryComponent: PropTypes.node,
  onAddToCart: PropTypes.func,
  onCartQuantityChange: PropTypes.func,
  onDeleteProduct: PropTypes.func,
  onProductFieldChange: PropTypes.func,
  onViewContextChange: PropTypes.func,
  priceRange: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  product: PropTypes.object,
  socialComponent: PropTypes.node,
  vendorName: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.object),
  topVariantComponent: PropTypes.node,
  viewAs: PropTypes.string
};

export default ProductDetail;
