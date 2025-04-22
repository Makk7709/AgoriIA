from reportlab.pdfgen import canvas

def create_empty_pdf(output_path):
    c = canvas.Canvas(output_path)
    c.drawString(100, 750, "Test PDF")
    c.save()

if __name__ == "__main__":
    create_empty_pdf("test/data/05-versions-space.pdf") 