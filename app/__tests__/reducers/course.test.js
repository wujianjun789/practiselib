
import { active, search } from '../../src/reducers/course';
test('active', () => {
    const before = {
        active: 0,
        search: '',
        results: [
            { avatar: "/images/1.jpg", name: "Liuxia@sansi.com" },
            { avatar: "", name: "Hello World" },
        ]
    }
    const after = {
        active: 1,
        search: '',
        results: [
            { avatar: "/images/1.jpg", name: "Liuxia@sansi.com" },
            { avatar: "", name: "Hello World" },
        ]
    }
    expect(active(before, 1)).toEqual(after);
});
test('search', () => {
    const before = {
        active: 1,
        search: '',
        results: [
            { avatar: "/images/1.jpg", name: "Liuxia@sansi.com" },
            { avatar: "", name: "Hello World" },
        ]
    }
    const after = {
        active: 0,
        search: 'hello',
        results: [
            { avatar: "/images/1.jpg", name: "Liuxia@sansi.com" },
            { avatar: "", name: "Hello World" },
        ]
    }
    expect(search(before, 'hello')).toEqual(after);
});

