async function test() {
  try {
    const res = await fetch('http://localhost:3001/api/equipment', {
      headers: {
        'Authorization': 'Bearer test' // dummy
      }
    });
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
test();
