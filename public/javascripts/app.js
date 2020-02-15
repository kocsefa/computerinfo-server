/* globals $ */
var io = io()
var dataTable = null
var lastSearch

io.on('data', function (data) {
  if (data.refresh) {
    dataTable.destroy()
    $('#userdata tbody').html('')
    getData()
  }
})

function getData() {
  $.ajax({
    url: '/computerInfo',
    method: 'get',
    success: function (data) {
      $.each(data, function (i, f) {
        //var className = (f.Status && f.Status === 'FAIL' ? 'text-danger' : 'text-success')
        var a = document.createElement('a')
        var linkText = document.createTextNode("SystemCenter")
        a.appendChild(linkText)
        a.href = '#'
        $('#userdata tbody').append(
          $('<tr>').append(// class="' + className + '">').append(
            $('<td>').text(f.ComputerName),
            $('<td>').text(f.UserName),
            $('<td>').text(f.TCPInfo && f.TCPInfo.IPv4),
            $('<td>').text(f.Manufacturer),
            $('<td>').text(f.Model),
            $('<td title="' + f.SerialNumber + '">').text(f.SerialNumber && f.SerialNumber.length > 16 ? (f.SerialNumber.substring(0, 16) + '...') : f.SerialNumber),
            $('<td>').text(f.OS),
            $('<td>').text(f.OSVersion),
            $('<td>').text(f.ConnectionTime),
            $('<td>').text(f.InstallDate),
            $('<td>').append(a)
          ))
      })
      dataTable = $('#userdata').DataTable()
    },
    error: function (err) {
      console.log(err)
    }
  })
}

$(function () {

  $('body').on('keyup', '#userdata_filter input', function () {
    lastSearch = $(this).val()
  })
  getData()
})
