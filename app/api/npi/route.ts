import { NextRequest, NextResponse } from "next/server";

const NPI_REGEX = /^\d{10}$/;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const npi = searchParams.get("npi")?.trim();

    if (!npi) {
        return NextResponse.json({ error: "Missing npi query parameter." }, { status: 400 });
    }

    if (!NPI_REGEX.test(npi)) {
        return NextResponse.json({ error: "Invalid NPI. Provide a 10-digit numeric NPI." }, { status: 400 });
    }

    const registryUrl = `https://npiregistry.cms.hhs.gov/api/?version=2.1&number=${npi}`;

    try {
        const response = await fetch(registryUrl, {
            method: "GET",
            headers: { Accept: "application/json" },
            // keep a small timeout to avoid hanging connections
            cache: "no-store",
        });

        if (!response.ok) {
            return NextResponse.json({ error: "NPI registry lookup failed." }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Unable to reach NPI registry." }, { status: 502 });
    }
}
