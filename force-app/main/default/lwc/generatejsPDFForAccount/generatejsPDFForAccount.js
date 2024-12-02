import { LightningElement, api } from "lwc";
import { loadScript } from "lightning/platformResourceLoader";
import JSPDF from "@salesforce/resourceUrl/jsPDF";
import getAccount from "@salesforce/apex/PdfGenerator.getAccount";
export default class GeneratejsPDFForAccount extends LightningElement {
  @api recordId;
  jsPDFInitialized = false;
  account;
  headers = this.createHeaders([
    {
      id: "Id",
      prompt: "Id",
      width: 80
    },
    {
      id: "FirstName",
      prompt: "First Name",
      width: 70
    },
    {
      id: "LastName",
      prompt: "Last Name",
      width: 70
    }
  ]);

  renderedCallback() {
    if (!this.jsPDFInitialized) {
      this.jsPDFInitialized = true;
      loadScript(this, JSPDF)
        .then(() => {
          console.log("jsPDF library loaded successfully!");
        })
        .catch((error) => {
          console.log("jsPDF library not loaded: " + error);
        });
    }
  }

  handleClickGeneratePDF() {
    getAccount({ accountId: this.recordId })
      .then((result) => {
        this.account = result;
        this.contacts = result.contacts;
        this.generatePDF();
      })
      .catch((error) => {
        console.log("Error getting account: " + error);
      });
  }

  generatePDF() {
    if (this.jsPDFInitialized) {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // add content to the PDF
        const title = "Account Information";
        const pageWidth = doc.internal.pageSize.width;
        doc.setFontSize(20);
        const titleWidth = doc.getTextWidth(title);
        const xTitlePosition = (pageWidth - titleWidth) / 2;
        doc.text(title, xTitlePosition, 10);
        doc.setLineWidth(1.5);
        doc.line(xTitlePosition, 15, xTitlePosition + titleWidth, 15);
        doc.setFontSize(16);
        doc.text("Account Name: " + this.account.Name, 20, 30);
        doc.text("Account Phone: " + this.account.Phone, 20, 40);
        doc.text("Account Type: " + this.account.Type, 20, 50);
        doc.text("Account Industry: " + this.account.Industry, 20, 60);
        doc.setLineWidth(0.5);
        doc.text(
          "Related Contacts (" + this.account.Contacts.length + ")",
          20,
          75
        );
        doc.table(20, 80, this.account.Contacts, this.headers, {
          autoSize: false
        });
        doc.save("download.pdf");
      } catch (error) {
        console.log(error);
      }
    }
  }

  createHeaders(keys) {
    let result = [];
    for (let i = 0; i < keys.length; i++) {
      result.push({
        id: keys[i].id,
        name: keys[i].id,
        prompt: keys[i].prompt,
        width: keys[i].width,
        align: "center",
        padding: 0
      });
    }
    return result;
  }
}
