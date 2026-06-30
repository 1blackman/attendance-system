const form = document.getElementById("attendanceForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const employee = document.getElementById("employee").value;
    const type = document.getElementById("type").value;
    const locationInput = document.getElementById("location");
    const status = document.getElementById("status");

    status.innerHTML = "📍 جاري تحديد موقعك...";

    if (!navigator.geolocation) {
        status.innerHTML = "❌ المتصفح لا يدعم تحديد الموقع";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            locationInput.value = `${latitude}, ${longitude}`;

            const data = {
                employee: employee,
                type: type,
                latitude: latitude,
                longitude: longitude,
                time: new Date().toLocaleString()
            };

            try {

                const response = await fetch("https://seift.app.n8n.cloud/webhook-test/attendance", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    status.innerHTML = "✅ تم إرسال البيانات بنجاح";
                } else {
                    status.innerHTML = "❌ فشل إرسال البيانات";
                }

            } catch (error) {
                console.error(error);
                status.innerHTML = "❌ حدث خطأ أثناء الاتصال";
            }

        },
        function () {
            status.innerHTML = "❌ يرجى السماح بالوصول إلى الموقع";
        }
    );
});