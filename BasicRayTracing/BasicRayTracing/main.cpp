#include <iostream>
#include <conio.h>
#include <stdio.h>

/*
* Example of ray tracing to a fixed plane in the z axis
* https://gabrielgambetta.com/computer-graphics-from-scratch/02-basic-raytracing.html
*/

const int canvasW = 60;
const int canvasH = 60;
const int viewportH = 1;
const int viewportV = 1;
const float viewPortz = 1;//viewport distance from origin
float planeZ = 1;//plane parallel to Z axis
float planeX = -0.250;
float planeY = -0.250;
const float planeW = 0.5;
const float planeH = 0.5;

char buffer[canvasH * canvasW];

int canvasToScreenX(int x)
{
	return canvasW / 2 + x;
}

int canvasToScreenY(int y)
{
	return canvasH / 2 + y;
}

float canvasToViewPortX(float x)
{
	return x * viewportH / canvasW;
}

float canvasToViewPortY(float y)
{
	return y * viewportV / canvasH;
}

bool rayCastToPlaneInZ(float viewPortx, float viewPortY)
{
	//extract the x position that intersect in the plane
	float b = 0;
	float m = viewPortx / viewPortz;
	float x = planeZ;
	float y = m * x + b;
	float rayx = y;

	//extract the y position that instersects in the plane
	b = 0;
	m = viewPortY / viewPortz;
	x = planeZ;
	y = m * x + b;
	float rayy = y;

	bool insideX = rayx >= planeX && rayx <= planeX + planeW;
	bool insideY = rayy >= planeY && rayy <= planeY + planeH;

	return insideX && insideY;
}

void render()
{
	for (int y = -canvasH / 2; y < canvasH / 2; y++)
	{
		for (int x = -canvasW / 2; x < canvasW / 2; x++)
		{
			float viewPortY = canvasToViewPortY(y);
			float viewPortX = canvasToViewPortX(x);
			bool intersects = rayCastToPlaneInZ(viewPortX, viewPortY);

			int screenX = canvasToScreenX(x);
			int screenY = canvasToScreenY(y);

			char color = intersects ? '#' : '_';
			buffer[screenY * canvasW + screenX] = color;
		}
	}

	for (int y = 0; y < canvasH; y++)
	{
		for (int x = 0; x < canvasW; x++)
		{
			std::cout << buffer[y * canvasW + x];
		}

		std::cout << std::endl;
	}
	std::cout << "Current position: (" << planeX << "," << planeY << "," << planeZ << ")"<<std::endl;
}

void clear() {
	// CSI[2J clears screen, CSI[H moves the cursor to top-left corner
	std::cout << "\x1B[2J\x1B[H";
}

int main()
{

	/*
	* 10 esc
	*/
	int key = -1;
	int esc_key = 27;
	int up_arrow = 72;
	int down_arrow = 80;
	int left_arrow = 75;
	int right_arrow = 77;

	render();
	float delta = 0.05;

	while (key != esc_key)
	{
		key = _getch();

		if (key == down_arrow)
		{
			planeZ -= delta;
			clear();
			render();
		}
		else if (key == up_arrow)
		{
			planeZ += delta;
			clear();
			render();
		}
		else if (key == left_arrow)
		{
			planeX -= delta;
			clear();
			render();
		}
		else if (key == right_arrow)
		{
			planeX += delta;
			clear();
			render();
		}

		std::cout << std::endl;
	}


	clear();


	return 0;
}