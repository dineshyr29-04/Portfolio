# Generate raster fallbacks from the same geometric mark as public/favicon.svg.
Add-Type -AssemblyName System.Drawing
$assetRoot = Join-Path $PSScriptRoot '../public'
$navy = [System.Drawing.ColorTranslator]::FromHtml('#0B1736')
$blue = [System.Drawing.ColorTranslator]::FromHtml('#2563EB')
$whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$navyBrush = [System.Drawing.SolidBrush]::new($navy)
$blueBrush = [System.Drawing.SolidBrush]::new($blue)
try {
  foreach ($item in @(@{Size=32;Name='favicon-32.png'}, @{Size=180;Name='apple-touch-icon.png'}, @{Size=192;Name='icon-192.png'}, @{Size=512;Name='icon-512.png'})) {
    $bitmap = [System.Drawing.Bitmap]::new($item.Size, $item.Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    try {
      $graphics.SmoothingMode = 'AntiAlias'
      $graphics.ScaleTransform($item.Size / 64.0, $item.Size / 64.0)
      $path.AddArc(0,0,28,28,180,90)
      $path.AddArc(36,0,28,28,270,90)
      $path.AddArc(36,36,28,28,0,90)
      $path.AddArc(0,36,28,28,90,90)
      $path.CloseFigure()
      $graphics.FillPath($navyBrush,$path)
      $graphics.FillEllipse($whiteBrush,14,26,28,28)
      $graphics.FillRectangle($whiteBrush,34,14,8,40)
      $graphics.FillEllipse($navyBrush,22,34,12,12)
      $graphics.FillRectangle($blueBrush,48,46,8,8)
      $bitmap.Save((Join-Path $assetRoot $item.Name),[System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $path.Dispose()
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  }

  # PNG-compressed ICO: one 32px entry, usable by browsers requesting /favicon.ico.
  $png = [System.IO.File]::ReadAllBytes((Join-Path $assetRoot 'favicon-32.png'))
  $stream = [System.IO.File]::Create((Join-Path $assetRoot 'favicon.ico'))
  $writer = [System.IO.BinaryWriter]::new($stream)
  try {
    $writer.Write([uint16]0); $writer.Write([uint16]1); $writer.Write([uint16]1)
    $writer.Write([byte]32); $writer.Write([byte]32); $writer.Write([byte]0); $writer.Write([byte]0)
    $writer.Write([uint16]1); $writer.Write([uint16]32)
    $writer.Write([uint32]$png.Length); $writer.Write([uint32]22); $writer.Write($png)
  } finally { $writer.Dispose(); $stream.Dispose() }

  # Text-only social preview, matching the portfolio's typography and palette.
  $preview = [System.Drawing.Bitmap]::new(1200,630)
  $canvas = [System.Drawing.Graphics]::FromImage($preview)
  $labelFont = [System.Drawing.Font]::new('Consolas',18,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
  $headlineFont = [System.Drawing.Font]::new('Arial',80,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
  $bodyFont = [System.Drawing.Font]::new('Arial',24,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
  $mutedBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#64748B'))
  $borderPen = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#DCE5F2'))
  try {
    $canvas.Clear([System.Drawing.ColorTranslator]::FromHtml('#F5F8FF'))
    $canvas.TextRenderingHint = 'AntiAliasGridFit'
    $canvas.DrawString('DINESH A. / SOFTWARE ENGINEERING',$labelFont,$navyBrush,64,56)
    $canvas.FillRectangle($blueBrush,1116,62,16,16)
    $canvas.DrawString('Good software.',$headlineFont,$navyBrush,58,165)
    $canvas.DrawString('From the inside out.',$headlineFont,$navyBrush,58,260)
    $canvas.DrawString('Rust / Distributed systems / Full-stack development',$bodyFont,$mutedBrush,64,401)
    $canvas.DrawLine($borderPen,64,515,1136,515)
    $canvas.DrawString('dinesha.tech',$labelFont,$blueBrush,64,548)
    $preview.Save((Join-Path $assetRoot 'social-preview.png'),[System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $borderPen.Dispose(); $mutedBrush.Dispose(); $labelFont.Dispose()
    $headlineFont.Dispose(); $bodyFont.Dispose(); $canvas.Dispose(); $preview.Dispose()
  }
} finally { $whiteBrush.Dispose(); $navyBrush.Dispose(); $blueBrush.Dispose() }
