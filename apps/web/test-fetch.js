import net from "net";

const client = net.createConnection(
	{ port: 443, host: "api.jikan.moe" },
	() => {
		console.log("Connected to server!");
		client.end();
	}
);

client.on("error", (err) => {
	console.error("Connection error:", err);
});

client.setTimeout(5000, () => {
	console.log("Connection timed out");
	client.destroy();
});
