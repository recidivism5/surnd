function normalize_vec(v)
{
    let sum = 0.0;
    let i;
    for (i = 0; i < v.length; i++)
    {
        sum += v[i];
    }
    for (i = 0; i < v.length; i++)
    {
        v[i] /= sum;
    }
}

function gd(a, b, x)
{
    let c = (x-b) / a;
    return Math.exp((-.5) * c * c) / (a * Math.sqrt(2 * Math.PI));
}

function make_gv(a, x0, x1, length)
{
    let v = [];

    let step = (x1 - x0) / length;
    let offset = length/2;

    for (let i = 0; i < length; i++)
    {
        v[i] = gd(a, 0, (i-offset)*step);
    }
    normalize_vec(v);
    return v;
}
